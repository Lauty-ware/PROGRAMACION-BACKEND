Feature: Gestión de Tareas
  Como usuario del sistema
  Quiero gestionar mis tareas
  Para organizar mi trabajo diario de manera eficiente

  Background:
    Given existe un usuario con ID "1"
    And existe un proyecto con ID "1" asociado al usuario "1"
    And existen tareas con los siguientes datos:
      | id | titulo           | prioridad | estado     | proyecto_id | usuario_id |
      | 1  | Tarea importante | alta      | pendiente  | 1           | 1          |
      | 2  | Tarea secundaria | media     | completada | 1           | 1          |

  Scenario: Crear tarea en proyecto
    Given estoy autenticado como usuario "1"
    When creo una tarea con los siguientes datos:
      | titulo           | descripción     | prioridad | proyecto_id |
      | Nueva tarea      | Descripción     | alta      | 1           |
    Then la tarea debe ser creada exitosamente
    And la tarea debe tener estado "pendiente" por defecto
    And la tarea debe estar asociada al proyecto "1"

  Scenario: Crear tarea sin proyecto asignado
    When creo una tarea con los siguientes datos:
      | titulo           | prioridad |
      | Tarea individual | media     |
    Then la tarea debe ser creada exitosamente
    And proyecto_id debe ser NULL

  Scenario: Marcar tarea como completada
    Given existe una tarea con ID "1" en estado "pendiente"
    When marco la tarea "1" como completada
    Then la tarea debe tener estado "completada"
    And la fecha de actualización debe ser actualizada

  Scenario: Intentar completar tarea ya completada
    Given existe una tarea con ID "2" en estado "completada"
    When intento marcar la tarea "2" como completada
    Then debe retornar un error de validación
    And el mensaje de error debe ser "La tarea ya está completada"

  Scenario: Obtener tareas por prioridad
    When solicito todas las tareas con prioridad "alta"
    Then debe retornar al menos una tarea
    And todas deben tener prioridad "alta"

  Scenario: Obtener tareas por estado
    When solicito todas las tareas pendientes
    Then debe retornar tareas con estado "pendiente"
    And no debe incluir tareas completadas

  Scenario: Obtener tareas de un proyecto
    Given existe un proyecto con ID "1"
    When solicito todas las tareas del proyecto "1"
    Then debe retornar 2 tareas
    And ambas deben tener proyecto_id "1"

  Scenario: Actualizar prioridad de tarea
    Given existe una tarea con ID "1" con prioridad "alta"
    When actualizo la tarea "1" cambiando prioridad a "baja"
    Then la tarea debe tener prioridad "baja"

  Scenario: Eliminar tarea
    Given existe una tarea con ID "3"
    When elimino la tarea "3"
    Then la tarea debe ser eliminada
    And no debe poder obtenerse por ID

  Scenario: Validar campos obligatorios
    When intento crear una tarea sin título
    Then debe retornar un error de validación
    And el mensaje de error debe ser "El título es requerido"

  Scenario: Validar fecha de vencimiento
    When intento crear una tarea con fecha de vencimiento en el pasado
    Then debe retornar un error de validación
    And el mensaje de error debe ser "La fecha de vencimiento no puede ser en el pasado"