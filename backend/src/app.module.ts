import { GreetingResolver, GreetingService } from '@/features/greeting';
import { UserRepository, UserResolver, UsersService } from '@/features/user';
import { DatabaseClient } from '@/lib/database-client';
import { HealthCheckController } from '@/features/health-check';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [HealthCheckController],
  providers: [
    DatabaseClient,
    UserRepository,
    UsersService,
    UserResolver,
    GreetingService,
    GreetingResolver,
  ],
})
export class AppModule {}
