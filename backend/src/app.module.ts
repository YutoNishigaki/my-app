import { GreetingModule } from '@/features/greeting';
import { HealthCheckModule } from '@/features/health-check';
import { HousekeepingModule } from '@/features/housekeeping';
import { UserModule } from '@/features/user';
import { DatabaseModule } from '@/lib/database.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    HealthCheckModule,
    GreetingModule,
    HousekeepingModule,
    UserModule,
  ],
})
export class AppModule {}
