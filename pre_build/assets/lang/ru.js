languages.ru = {
  helpers: {
    date: {
      hours: ['час', 'часа', 'часов'],
      minutes: ['минута', 'минуты', 'минут'],
      seconds: ['секунда', 'секунды', 'секунд']
    },
    shortDate: {
      hours: 'ч',
      minutes: 'м',
      seconds: 'с'
    },
    close: 'Закрыть',
    popup: {
      error: {
        title: 'Ошибка',
        name: 'Неизвестная ошибка',
        description: 'Перезапустите приложение, и повторите операцию'
      }
    }
  },
  lang: {
    code: 'RU',
    name: 'Russian',
    title: 'Русский',
    button: 'Язык'
  },
  system: {
    noInternet: {
      message: 'Отсутствует подключение к интернету',
      button: 'Повторить'
    },
    serverNotRespond: {
      message: 'Сервер не отвечает',
      button: 'Повторить'
    }
  },
  coming: {
    cta: 'Проголосовать',
    title: 'Проголосовать',
    description: 'Голосуя за будущий функционал, вы помогаете нам определить приоритеты разработки',
    stars: {
      1: 'Мне не требуется',
      2: 'Пусть будет',
      3: 'Я бы попробовал',
      4: 'Очень не хватает',
      5: 'Критически важно'
    },
    accountEdit: {
      cover: 'Редактирование аккаунта - Скоро!',
      title: 'Редактирование аккаунта',
      description: 'Позволяет изменить данные добавленного аккаунта: Аватар, Username, Имя, Фамилию, Описание'
    },
    accountChats: {
      cover: 'Чаты -  Скоро!',
      title: 'Чаты',
      description: 'Позволяет аккаунту вступать в группы и каналы, а так же вести переписку с пользователями'
    }
  },
  pages: {
    auth: {
      signIn: {
        placeholders: {
          email: 'Email',
          password: 'Password'
        },
        button: 'Войти',
        recover: 'Забыли пароль?',
        signUp: 'Нет аккаунта? <span>Зарегистрироваться</span>'
      },
      signUp: {
        placeholders: {
          email: 'Email',
          password: 'Password (минимум 6 символов)',
          passwordConfirm: 'Повторите Password'
        },
        button: 'Зарегистрировать',
        signIn: 'Уже есть аккаунт? <span>Авторизироваться</span>'
      },
      recover: {
        placeholders: {
          email: 'Email'
        },
        messages: {
          newPassword: 'Новый пароль выслан на почту',
          wrongEmail: 'Такой Email не зарегистрирован'
        },
        button: 'Восстановить',
        signIn: 'Войти',
        signUp: 'Нет аккаунта? <span>Зарегистрироваться</span>'
      }
    },
    resources: {
      title: 'Ресурсы',
      tabs: {
        accounts: {
          title: 'Аккаунты',
          table: {
            header: {
              search: 'Найти аккаунт',
              buttons: {
                addAccounts: 'Добавить аккаунты',
                createGroup: 'Создать группу'
              },
              actions: {
                addToGroup: 'Добавить в группу',
                check: 'Проверить аккаунт',
                remove: 'Удалить аккаунт'
              },
              columns: {
                button: 'Настроить колонки',
                popup: {
                  title: 'Колонки',
                  columns: {
                    pinned: 'Закрепленные',
                    unpinned: 'Свободные'
                  },
                  buttons: {
                    save: 'Сохранить'
                  }
                }
              },
              filter: {
                button: 'Фильтр',
                selectedButton: 'Изменить фильтрацию',
                popup: {
                  title: 'Фильтр',
                  filters: {
                    status: {
                      title: 'Статус',
                      options: {
                        new: 'New',
                        active: 'Active',
                        floodWait: 'Flood Wait',
                        floodBan: 'Flood Ban',
                        ban: 'Banned'
                      }
                    },
                    proxy: {
                      title: 'Прокси',
                      placeholder: 'Выберите прокси'
                    }
                  },
                  buttons: {
                    apply: 'Применить',
                    clear: 'Очистить'
                  }
                }
              }
            },
            caption: {
              select: 'Выбор',
              id: 'Идентификатор',
              status: 'Статус',
              floodTime: 'Flood Wait',
              name: 'Имя аккаунта',
              proxy: 'Прокси',
              group: 'Группа',
              actions: 'Действия',
              messages: 'Сообщения',
              reactions: 'Реакции',
              invites: 'Приглашения',
              reports: 'Жалобы',
              votes: 'Голоса',
              check: 'Проверить аккаунт'
            },
            rows: {
              statuses: {
                new: 'New',
                active: 'Active',
                floodWait: 'Flood Wait',
                floodBan: 'Flood Ban',
                ban: 'Banned'
              },
              addProxy: 'Добавить прокси',
              addToGroup: 'Добавить в группу',
              actions: {
                show: 'Показать',
                hide: 'Скрыть'
              }
            },
            footer: {
              rowsOnPage: 'Строк на странице',
              of: 'из'
            }
          },
          addAccounts: {
            button: 'Добавить аккаунты',
            popup: {
              title: 'Добавить аккаунты',
              tabs: {
                tdata: {
                  title: 'Tdata',
                  description: 'Выберите папку в которой находится папка tdata или папку с папками в которых находятся папки tdata',
                  input: '2FA Пароль',
                  comingSoon: '2FA Авторизация - Скоро!',
                  button: {
                    selectFolder: 'Выбрать папку',
                    error: 'TDATA аккаунты не найдены'
                  }
                },
                session: {
                  title: 'Session',
                  description: 'Выберите папку в которой находится файлы сессий в формате JSON',
                  input: '2FA Пароль',
                  comingSoon: 'Session аккаунты - Скоро!',
                  button: {
                    selectFolder: 'Выбрать папку',
                    error: 'Session аккаунты не найдены'
                  }
                },
                sms: {
                  title: 'SMS',
                  inputs: {
                    phone: 'Номер телефона',
                    sms: 'Введите Код из SMS'
                  },
                  comingSoon: 'SMS авторизация - Скоро!',
                  button: {
                    sms: 'Отправить SMS',
                    login: 'Войти',
                    errors: {
                      ban: 'Аккаунт заблокирован',
                      notFound: 'Номер не зарегистрирован',
                      wrong: 'Неправильный номер',
                      sms: 'Неправильный код'
                    }
                  }
                }
              },
              added: {
                success: ['Добавлен', 'Добавлено', 'Добавлено'],
                accounts: ['аккаунт', 'аккаунта', 'аккаунтов'],
                errors: {
                  title: 'Предупреждение:',
                  bad: 'Ошибка',
                  double: 'Уже добавлен'
                },
                addMore: 'Добавить еще аккаунтов',
                nothing: 'Аккаунты не найдены'
              }
            }
          },
          removeAccounts: {
            popup: {
              title: 'Удалить',
              accounts: ['аккаунт', 'аккаунта', 'аккаунтов'],
              buttons: {
                confirm: 'Удалить',
                cancel: 'Отмена'
              }
            }
          },
          edit: {
            title: 'Редактировать',
            account: 'Аккаунт - ',
            inAppName: 'Имя аккаунта в приложении',
            limits: {
              messages: {
                label: 'Лимит сообщений в день',
                input: 'Лимита нет'
              },
              invites: {
                label: 'Лимит приглашений в день',
                input: 'Лимита нет'
              }
            },
            button: {
              save: 'Сохранить'
            },
            telegram: {
              title: 'Данные аккаунта в Telegram',
              firstname: 'Имя',
              lastname: 'Фамилия',
              username: '@username',
              about: 'Описание',
            },
            chats: {
              title: 'Чаты',
              search: 'Поиск'
            }
          }
        },
        proxies: {
          title: 'Прокси'
        },
        autoreg: {
          title: 'Авторег'
        }
      }
    },
    audiences: {
      title: 'Аудитория'
    },
    accounts: {
      title: 'Аккаунты',
      tabs: {
        spam: {
          title: 'Рассылка'
        },
        comment: {
          title: 'Комментирование'
        },
        view: {
          title: 'Просмотры'
        },
        reaction: {
          title: 'Реакции'
        },
        vote: {
          title: 'Голосования'
        },
        report: {
          title: 'Жалобы'
        }
      }
    },
    groups: {
      title: 'Сообщества',
      tabs: {
        invite: {
          title: 'Инвайтинг'
        },
        clone: {
          title: 'Клонирование'
        },
        post: {
          title: 'Постинг'
        }
      }
    },
    settings: {
      title: 'Настройки'
    },
    account: {
      title: 'Аккаунт'
    }
  }
}
