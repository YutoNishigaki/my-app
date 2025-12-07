import { Module } from '@nestjs/common';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { AppController } from './app.controller.js';
import { AppResolver } from './app.resolver.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
