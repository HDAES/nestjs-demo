import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger/dist';
export default class Swagger {
  constructor(app) {
    const config = new DocumentBuilder()
      .setTitle('接口文档')
      .setDescription('描述，。。。')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api-docs', app, document);
  }
}
