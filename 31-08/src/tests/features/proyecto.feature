Feature: Gestión de Proyectos
  Como usuario del sistema
  Quiero gestionar mis proyectos
  Para organizar mi trabajo de manera efectiva

  Background:
    Given existe un usuario con ID "1" llamado "Juan Pérez"
    And existe un usuario con ID "2" llamado "María García"
    And existe un proyecto con los siguientes datos:
      | id | nombre           | descripción           | estado  | usuario_id |
      | 1  | Proyecto Alpha   | Proyecto de prueba    | activo  | 1          |
      | 2  | Proyecto Beta    | Segundo proyecto      | activo  | 1          |

  Scenario: Crear un nuevo proyecto
    Given estoy autenticado como usuario "1"
    When creo un proyecto con los siguientes datos:
      | nombre          | descripción           | usuario_id |
      | Proyecto Gamma  | Tercer proyecto       | 1          |
    Then el proyecto debe ser creado exitosamente
    And el estado del proyecto debe ser "activo" por defecto
    And el proyecto debe estar asociado al usuario "1"

  Scenario: Crear proyecto con usuario inexistente
    When intento crear un proyecto con los siguientes datos:
      | nombre        | descripción    | usuario_id |
      | Proyecto Error | Proyecto test  | 999        |
    Then debe retornar un error de validación
    And el mensaje de error debe ser "Usuario con ID 999 no encontrado"

  Scenario: Obtener proyectos de un usuario
    Given existe un usuario con ID "1"
    When solicito todos los proyectos del usuario "1"
    Then debe retornar 2 proyectos
    And los proyectos deben pertenecer al usuario "1"

  Scenario: Actualizar estado del proyecto
    Given existe un proyecto con ID "1" en estado "activo"
    When actualizo el proyecto "1" con estado "completado"
    Then el proyecto debe tener estado "completado"
    And la fecha de actualización debe ser actualizada

  Scenario: Verificar fechas del proyecto
    Given estoy creando un proyecto
    When establezco fecha de inicio "2024-01-01" y fecha de fin "2024-12-31"
    Then las fechas deben ser válidas
    And la fecha de inicio debe ser anterior a la fecha de fin

  Scenario: Intentar crear proyecto con fechas inválidas
    When intento crear un proyecto con fecha de inicio "2024-12-31" y fecha de fin "2024-01-01"
    Then debe retornar un error de validación
    And el mensaje de error debe ser "La fecha de inicio no puede ser posterior a la fecha de fin"

  Scenario: Eliminar proyecto existente
    Given existe un proyecto con ID "2"
    And el proyecto tiene tareas asociadas
    When elimino el proyecto "2"
    Then el proyecto debe ser eliminado
    And las tareas asociadas deben tener proyecto_id = NULL

  Scenario: Contar proyectos de usuario
    Given existe un usuario con ID "1"
    When consulto el número de proyectos del usuario "1"
    Then debe retornar 2