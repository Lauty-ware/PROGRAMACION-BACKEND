Feature: Gestión de Usuarios
  Como administrador del sistema
  Quiero gestionar los usuarios
  Para controlar el acceso a la aplicación

  Background:
    Given existe un usuario con los siguientes datos:
      | nombre     | email           | password  | rol      |
      | Juan Pérez | juan@test.com   | password1 | admin    |
      | María García | maria@test.com | password2 | usuario  |

  Scenario: Crear un nuevo usuario
    Given no existe un usuario con email "nuevo@test.com"
    When creo un usuario con los siguientes datos:
      | nombre        | email            | password  |
      | Nuevo Usuario | nuevo@test.com   | password3 |
    Then el usuario debe ser creado exitosamente
    And el usuario debe tener el rol "usuario" por defecto
    And la respuesta debe incluir el ID del usuario

  Scenario: Intentar crear usuario con email duplicado
    Given existe un usuario con email "maria@test.com"
    When intento crear un usuario con los siguientes datos:
      | nombre        | email           | password  |
      | María Duplicada | maria@test.com | password3 |
    Then debe retornar un error de conflicto
    And el mensaje de error debe ser "El email ya está registrado"

  Scenario: Obtener usuario por ID
    Given existe un usuario con ID "1"
    When solicito obtener el usuario con ID "1"
    Then el usuario debe ser retornado exitosamente
    And la contraseña no debe ser visible en la respuesta

  Scenario: Actualizar usuario existente
    Given existe un usuario con ID "2"
    When actualizo el usuario con ID "2" con los siguientes datos:
      | nombre         | email            |
      | María Actualizada | maria.nueva@test.com |
    Then el usuario debe ser actualizado exitosamente
    And el nombre debe ser "María Actualizada"

  Scenario: Actualizar usuario con email existente de otro usuario
    Given existe un usuario con email "juan@test.com"
    And existe un usuario con ID "2"
    When intento actualizar el usuario con ID "2" con email "juan@test.com"
    Then debe retornar un error de conflicto
    And el mensaje de error debe ser "El email ya está registrado por otro usuario"

  Scenario: Desactivar usuario
    Given existe un usuario con ID "1"
    When elimino (desactivo) el usuario con ID "1"
    Then el usuario debe ser desactivado exitosamente
    And el usuario no debe aparecer en la lista de usuarios activos

  Scenario: Eliminar usuario permanentemente
    Given existe un usuario con ID "3"
    And no tiene proyectos asociados
    When elimino permanentemente el usuario con ID "3"
    Then el usuario debe ser eliminado de la base de datos
    And no debe poder obtenerse por ID