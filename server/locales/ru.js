export default {
  translation: {
    appName: 'Менеджер задач',
    buttons: {
      create: 'Создать',
      change: 'Изменить',
      delete: 'Удалить',
      login: 'Войти',
      save: 'Сохранить',
      show: 'Показать',
    },
    flash: {
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
      notCurrentUser: 'Вы не можете редактировать или удалять другого пользователя',
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        update: {
          success: 'Метка успешно изменена',
          error: 'Не удалось обновить метку',
          labelConnectedToTask: 'Вы не можете удалить эту метку. Метка связана с одной или несколькими задачами',
        },
        delete: {
          success: 'Метка успешно удалена',
          error: 'Не удалось удалить метку',
        },
      },
      session: {
        create: {
          success: 'Вы залогинены',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось обновить статус',
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
        },
      },
      tasks: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        update: {
          success: 'Задача успешно изменена',
          error: 'Не удалось обновить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
          error: 'Не удалось удалить задачу',
          errorAccess: 'Задачу может удалить только её автор',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
      },
    },
    labels: {
      index: {
        title: 'Метки',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        buttons: {
          create: 'Создать метку',
        },
      },
      new: {
        title: 'Создание метки',
      },
      edit: {
        title: 'Изменение метки',
      },
    },
    layouts: {
      application: {
        labels: 'Метки',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        tasks: 'Задачи',
        users: 'Пользователи',
      },
    },
    session: {
      new: {
        signIn: 'Вход',
      },
    },
    welcome: {
      index: {
        hello: 'Привет от Хекслета!',
        description: 'Практические курсы по программированию',
        more: 'Узнать Больше',
      },
    },
    statuses: {
      index: {
        title: 'Статусы',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        buttons: {
          create: 'Создать статус',
        },
      },
      new: {
        title: 'Создание статуса',
      },
      edit: {
        title: 'Изменение статуса',
      },
    },
    tasks: {
      index: {
        title: 'Задачи',
        id: 'ID',
        taskName: 'Наименование',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        createdAt: 'Дата создания',
        actions: 'Действия',
        isCreatorUser: 'Только мои задачи',
        label: 'Метка',
        buttons: {
          create: 'Создать задачу',
        },
      },
      new: {
        title: 'Создание задачи',
      },
      edit: {
        title: 'Изменение задачи',
      },
    },
    users: {
      index: {
        title: 'Пользователи',
        id: 'ID',
        fullName: 'Полное имя',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
      },
      new: {
        title: 'Регистрация',
      },
      edit: {
        title: 'Изменение пользователя',
      },
    },
    forms: {
      description: 'Описание',
      executorId: 'Исполнитель',
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Email',
      name: 'Наименование',
      password: 'Пароль', // NOSONAR - translation key, not a password
      statusId: 'Статус',
      labels: 'Метки',
    },
  },
};
