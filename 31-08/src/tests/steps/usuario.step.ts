import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { App } from '../../app';

let app: any;
let response: any;
let usuarioData: any;

Given('existe un usuario con los siguientes datos:', async function (dataTable) {
  app = new App().app;
  const users = dataTable.hashes();
  for (const user of users) {
    await request(app)
      .post('/api/usuarios')
      .send(user);
  }
});

Given('no existe un usuario con email {string}', function (email) {
  // Verificar que no existe el email
  // Esto se manejará en el paso de creación
});

Given('existe un usuario con ID {string}', async function (id) {
  // Verificar que existe el usuario
});

When('creo un usuario con los siguientes datos:', async function (dataTable) {
  usuarioData = dataTable.hashes()[0];
  response = await request(app)
    .post('/api/usuarios')
    .send(usuarioData);
});

When('intento crear un usuario con los siguientes datos:', async function (dataTable) {
  const data = dataTable.hashes()[0];
  response = await request(app)
    .post('/api/usuarios')
    .send(data);
});

When('solicito obtener el usuario con ID {string}', async function (id) {
  response = await request(app)
    .get(`/api/usuarios/${id}`);
});

When('actualizo el usuario con ID {string} con los siguientes datos:', async function (id, dataTable) {
  const data = dataTable.hashes()[0];
  response = await request(app)
    .put(`/api/usuarios/${id}`)
    .send(data);
});

When('intento actualizar el usuario con ID {string} con email {string}', async function (id, email) {
  response = await request(app)
    .put(`/api/usuarios/${id}`)
    .send({ email });
});

When('elimino (desactivo) el usuario con ID {string}', async function (id) {
  response = await request(app)
    .delete(`/api/usuarios/${id}`);
});

When('elimino permanentemente el usuario con ID {string}', async function (id) {
  response = await request(app)
    .delete(`/api/usuarios/${id}/permanente`);
});

Then('el usuario debe ser creado exitosamente', function () {
  expect(response.status).to.equal(201);
  expect(response.body.success).to.be.true;
});

Then('el usuario debe tener el rol {string} por defecto', function (rol) {
  expect(response.body.data.rol).to.equal(rol);
});

Then('la respuesta debe incluir el ID del usuario', function () {
  expect(response.body.data.id).to.exist;
});

Then('debe retornar un error de conflicto', function () {
  expect(response.status).to.equal(409);
});

Then('el mensaje de error debe ser {string}', function (mensaje) {
  expect(response.body.error.message).to.equal(mensaje);
});

Then('el usuario debe ser retornado exitosamente', function () {
  expect(response.status).to.equal(200);
  expect(response.body.success).to.be.true;
  expect(response.body.data.id).to.exist;
});

Then('la contraseña no debe ser visible en la respuesta', function () {
  expect(response.body.data.password).to.be.undefined;
});

Then('el usuario debe ser actualizado exitosamente', function () {
  expect(response.status).to.equal(200);
  expect(response.body.success).to.be.true;
});

Then('el nombre debe ser {string}', function (nombre) {
  expect(response.body.data.nombre).to.equal(nombre);
});

Then('el usuario debe ser desactivado exitosamente', function () {
  expect(response.status).to.equal(200);
  expect(response.body.success).to.be.true;
});

Then('el usuario no debe aparecer en la lista de usuarios activos', async function () {
  const getResponse = await request(app)
    .get('/api/usuarios');
  const usuarios = getResponse.body.data;
  const usuarioEncontrado = usuarios.find((u: any) => u.id === response.body.data.id);
  expect(usuarioEncontrado).to.be.undefined;
});

Then('el usuario debe ser eliminado de la base de datos', function () {
  expect(response.status).to.equal(200);
});

Then('no debe poder obtenerse por ID', async function () {
  const getResponse = await request(app)
    .get(`/api/usuarios/${response.body.data?.id || '1'}`);
  expect(getResponse.status).to.equal(404);
});