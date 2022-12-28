import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Index, ManyToOne, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity( { name: 'lists' } )
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID)
  id: string;

  @Column()
  @Field( () => String )
  name: string;

  // Relación, index('userId-list-index')
  @ManyToOne( () => User, ( user ) => user.lists, { nullable: false, lazy: true } )
  @Index( 'userId-ist-index' )
  @Field( () => User )
  user: User;

  @OneToMany( () => ListItem, (listItem) => listItem.list, { lazy: true } )
  // @Field( () => [ListItem] )
  listItem: ListItem[];
}
