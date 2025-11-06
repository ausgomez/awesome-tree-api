import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TreeModule } from './tree/tree.module';

@Module({
  imports: [TreeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
