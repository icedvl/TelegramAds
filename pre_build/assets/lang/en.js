languages.en = {
  helpers: {
    date: {
      hours: ['hour', 'hours', 'hours'],
      minutes: ['minute', 'minutes', 'minutes'],
      seconds: ['second', 'seconds', 'seconds']
    },
    shortDate: {
      hours: 'h',
      minutes: 'm',
      seconds: 's'
    },
    close: 'Close',
    popup: {
      error: {
        title: 'Error',
        name: 'Unknown error',
        description: 'Restart the application, and try again'
      }
    }
  },
  lang: {
    code: 'EN',
    name: 'English',
    title: 'English',
    button: 'Language'
  },
  system: {
    noInternet: {
      message: 'No internet connection',
      button: 'Retry'
    },
    serverNotRespond: {
      message: 'The server is not responding',
      button: 'Retry'
    }
  },
  coming: {
    cta: 'Vote',
    title: 'Vote',
    description: 'By voting for future functionality, you help us determine development priorities.',
    stars: {
      1: 'I don\'t need',
      2: 'Well, let it be',
      3: 'I would try',
      4: 'Very lacking',
      5: 'Critically important'
    },
    accountEdit: {
      cover: 'Editing account details - Coming soon!',
      title: 'Editing account details',
      description: 'Allows you to change the data of the added account: Avatar, Username, First Name, Last Name, Description'
    },
    accountChats: {
      cover: 'Chats -  Coming Soon!',
      title: 'Chats',
      description: 'Allows the account to join groups and channels, as well as to correspond with users'
    }
  },
  pages: {
    auth: {
      signIn: {
        placeholders: {
          email: 'Email',
          password: 'Password'
        },
        button: 'Sign In',
        recover: 'Forgot password?',
        signUp: 'Don’t have an account? <span>Sign Up</span>'
      },
      signUp: {
        placeholders: {
          email: 'Email',
          password: 'Password (min 6 charts)',
          passwordConfirm: 'Repeat password'
        },
        button: 'Sign Up',
        signIn: 'Do you have an account? <span>Sign In</span>'
      },
      recover: {
        placeholders: {
          email: 'Email'
        },
        messages: {
          newPassword: 'Password has been sent to the email',
          wrongEmail: 'Email not registered'
        },
        button: 'Recover',
        signIn: 'Sign In',
        signUp: 'Don’t have an account? <span>Sign Up</span>'
      }
    },
    resources: {
      title: 'Resources',
      tabs: {
        accounts: {
          title: 'Accounts',
          table: {
            header: {
              search: 'Find an account',
              buttons: {
                addAccounts: 'Add Accounts',
                createGroup: 'Create new group'
              },
              actions: {
                addToGroup: 'Add to group',
                check: 'Check account',
                remove: 'Remove account'
              },
              columns: {
                button: 'Configure columns',
                popup: {
                  title: 'Columns',
                  columns: {
                    pinned: 'Pinned',
                    unpinned: 'Unpinned'
                  },
                  buttons: {
                    save: 'Save'
                  }
                }
              },
              filter: {
                button: 'Filter',
                selectedButton: 'Change filters',
                popup: {
                  title: 'Filter',
                  filters: {
                    status: {
                      title: 'Status',
                      options: {
                        new: 'New',
                        active: 'Active',
                        floodWait: 'Flood Wait',
                        floodBan: 'Flood Ban',
                        ban: 'Banned'
                      }
                    },
                    proxy: {
                      title: 'Proxy',
                      placeholder: 'Select proxies'
                    }
                  },
                  buttons: {
                    apply: 'Apply',
                    clear: 'Clear'
                  }
                }
              }
            },
            caption: {
              select: 'Select',
              id: 'ID',
              status: 'Status',
              floodTime: 'Flood Wait',
              name: 'Account name',
              proxy: 'Proxy',
              group: 'Group',
              actions: 'Actions',
              messages: 'Messages',
              reactions: 'Reactions',
              invites: 'Invites',
              reports: 'Reports',
              votes: 'Votes',
              check: 'Check Account'
            },
            rows: {
              statuses: {
                new: 'New',
                active: 'Active',
                floodWait: 'Flood Wait',
                floodBan: 'Flood Ban',
                ban: 'Banned'
              },
              addProxy: 'Add proxy',
              addToGroup: 'Add to Group',
              actions: {
                show: 'Show',
                hide: 'Hide'
              }
            },
            footer: {
              rowsOnPage: 'Rows on page',
              of: 'of'
            }
          },
          addAccounts: {
            button: 'Add Accounts',
            popup: {
              title: 'Add Accounts',
              tabs: {
                tdata: {
                  title: 'Tdata',
                  description: 'Select the folder where the data folder is located or the folder with the folders where the data folders are located',
                  input: '2FA Password',
                  comingSoon: '2FA Authorization - Coming soon',
                  button: {
                    selectFolder: 'Select folder',
                    error: 'TDATA accounts not found'
                  }
                },
                session: {
                  title: 'Session',
                  description: 'Select the folder where the session files in JSON format are located',
                  input: '2FA Password',
                  comingSoon: 'Session accounts - Coming soon',
                  button: {
                    selectFolder: 'Select folder',
                    error: 'Session accounts not found'
                  }
                },
                sms: {
                  title: 'SMS',
                  inputs: {
                    phone: 'Phone Number',
                    sms: 'Enter Code from SMS'
                  },
                  comingSoon: 'SMS authorization - Coming soon',
                  button: {
                    sms: 'Send SMS',
                    login: 'Login',
                    errors: {
                      ban: 'Phone number is blocked',
                      notFound: 'Phone number not register',
                      wrong: 'Wrong number',
                      sms: 'Wrong Code'
                    }
                  }
                }
              },
              added: {
                success: ['Added', 'Added', 'Added'],
                accounts: ['account', 'accounts', 'accounts'],
                errors: {
                  title: 'Warnings',
                  bad: 'Error',
                  double: 'Already exist'
                },
                addMore: 'Add more accounts',
                nothing: 'Accounts not found'
              }
            }
          },
          removeAccounts: {
            popup: {
              title: 'Delete',
              accounts: ['account', 'accounts', 'accounts'],
              buttons: {
                confirm: 'Delete',
                cancel: 'Cancel'
              }
            }
          },
          edit: {
            title: 'Edit',
            account: 'Account - ',
            inAppName: 'Account name in app',
            limits: {
              messages: {
                label: 'Limit of messages per day',
                input: 'Unlimited'
              },
              invites: {
                label: 'Limit of invites per day',
                input: 'Unlimited'
              }
            },
            button: {
              save: 'Save'
            },
            telegram: {
              title: 'Telegram account details',
              firstname: 'First Name',
              lastname: 'Last Name',
              username: '@username',
              about: 'About',
            },
            chats: {
              title: 'Chats',
              search: 'Search'
            }
          }
        },
        proxies: {
          title: 'Proxies'
        },
        autoreg: {
          title: 'Autoreg'
        }
      }
    },
    audiences: {
      title: 'Audience'
    },
    accounts: {
      title: 'Accounts',
      tabs: {
        spam: {
          title: 'Spam'
        },
        comment: {
          title: 'Commenting'
        },
        view: {
          title: 'Views'
        },
        reaction: {
          title: 'Reactions'
        },
        vote: {
          title: 'Voting'
        },
        report: {
          title: 'Reporting'
        }
      }
    },
    groups: {
      title: 'Groups',
      tabs: {
        invite: {
          title: 'Inviting'
        },
        clone: {
          title: 'Cloning'
        },
        post: {
          title: 'Posting'
        }
      }
    },
    settings: {
      title: 'Settings'
    },
    account: {
      title: 'Account'
    }
  }
}
