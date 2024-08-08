import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { ReadingRecordsModule } from './reading-records/reading-records.module';
import { SearchBooksModule } from './search-books/search-books.module';
import { AuthModule } from './auth/auth.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [TodosModule, ReadingRecordsModule, SearchBooksModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
