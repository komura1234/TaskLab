<h1 align="center">Task Lab</h1>


## Descripcion del Proyecto

<p align="justify">
Aplicacion movil practica para crear y gestionar tareas. Crear y gestionar categorias

</p>

---

### Stack

* Nodejs 20 o 22
* Ionic v9
* Cordova
* Firebase
* Angular 22

## Instalacion

### Prerequisitos

* Nodejs 20 o 22
* Ionic v9

### Instalacion de Dependencias
```bash

   npm install 
   ionic serve
   
```

### Generar Archivos de Compilacion
se creo un archivo .yaml para ejecutar en github actions un workflow para la generacion de archivo APK y .IPA sin firma usando cordova. Realizar fork del repo.El archivo se localiza en .github/workflows.

Los archivos APK e IPA se descargan en los Artifacts de ejecuion. Se obetiene APK en debug y .IPA sin firma

Siga las siguientes instrucciones 
* Abrir pestana Actions de su fork
* Pulsar "I understand my workflows,go ahead enable them"
* Ir a Build APK e IPA -> Run Workflow


### Consideraciones
Para el manejo de firebase en la funcion de rconfig tener en cuenta el manejo de credenciales definidas en el archivo enviroment tanto .prod y dev localizados en el directorio src/enviroments


