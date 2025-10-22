import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { SedesModule } from './modules/sedes/sedes.module';
import { SociosModule } from './modules/socios/socios.module';
import { MembresiasModule } from './modules/membresias/membresias.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { CajaModule } from './modules/caja/caja.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuración de base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    
    // Módulos funcionales
    EmpresasModule,
    UsuariosModule,
    SedesModule, 
    SociosModule,
    MembresiasModule,
    PagosModule,
    CajaModule,
    // TODO: Completar otros módulos
    // VisitasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}