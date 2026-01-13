import { HealthCheckModule } from '@/features/health-check';
import { HousekeepingModule } from '@/features/housekeeping';
import { UserModule } from '@/features/user';
import { DatabaseModule } from '@/lib/database.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/generated/graphql/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    HealthCheckModule,
    HousekeepingModule,
    UserModule,
  ],
})
export class AppModule {}
