import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListItemService } from '../list-item/list-item.service';
import { List } from '../lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(ListItem)
        private readonly listItemsRepository: Repository<ListItem>,
        @InjectRepository(List)
        private readonly listsRepository: Repository<List>,

        private readonly usersService: UsersService,
        private readonly itemsService: ItemsService,
        private readonly listItemService: ListItemService,
        private readonly listService: ListsService,
    ){
        this.isProd = configService.get('STATE') === 'prod';
    }
    
    async executeSeed() {
        if( this.isProd ) {
            throw new UnauthorizedException(`We can't run SEED in production mode`);
        }

        // Limpiar la base de datos
        await this.deleteDatabase();

        // Cargar los usuarios
        const user = await this.loadUsers();

        // Crear items
        await this.loadItems(user);

        // Crear listas
        const list = await this.loadLists( user );

        // Crear listItems
        const items = await this.itemsService.findAll( user, { limit: 15, offset: 0 }, {} )
        await this.loadListItems( list, items );

        return true;
    }

    async deleteDatabase() {
        // Borrar listItems
        await this.listItemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        
        // Borrar List
        await this.listsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // Borrar ítems
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
        // Borrar usuarios
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }

    async loadUsers(): Promise<User> {
        const users = [];
        for( const user of SEED_USERS ){
            users.push(await this.usersService.create( user ) );
        }
        return users[0];
    }

    async loadItems(user: User): Promise<void> {
        const itemsPromises = [];
        for( const item of SEED_ITEMS ) {
            itemsPromises.push( this.itemsService.create( item, user ) );
        }
        await Promise.all( itemsPromises );
    }

    async loadLists( user: User ): Promise<List> {
        const lists = [];
        for ( const list of SEED_LISTS ){
            lists.push( await this.listService.create( list, user ) );
        }
        return lists[0];
    }

    async loadListItems( list: List, items: Item[] ): Promise<void> {
        for (const item of items) {
            await this.listItemService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1) === 0 ? false : true ,
                listId: list.id,
                itemId: item.id
            });
        }
    }
}
