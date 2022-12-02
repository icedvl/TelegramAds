const defaultPages = {
    open: 'resources',
    resources: 'accounts',
    accounts: 'spam',
    groups: 'invite'
}


const defaultParams = {
    pages: {
        resources: {
            tabs: {
                accounts: {
                    rowsOnPage: 20,
                    columns: {
                        select: {
                            name: 'select',
                            pinned: true,
                            selected: true,
                            order: 0
                        },
                        name: {
                            name: 'name',
                            pinned: true,
                            selected: true,
                            order: 1
                        },
                        status: {
                            name: 'status',
                            pinned: true,
                            selected: true,
                            order: 2
                        },
                        id: {
                            name: 'id',
                            pinned: false,
                            selected: true,
                            order: 0
                        },
                        floodTime: {
                            name: 'floodTime',
                            pinned: false,
                            selected: true,
                            order: 1
                        },
                        proxy: {
                            name: 'proxy',
                            pinned: false,
                            selected: true,
                            order: 2
                        },
                        // group: {
                        //     name: 'group',
                        //     pinned: false,
                        //     selected: true,
                        //     order: 3
                        // },
                        // actions: {
                        //     name: 'actions',
                        //     pinned: false,
                        //     selected: true,
                        //     order: 4
                        // },
                        messages: {
                            name: 'messages',
                            pinned: false,
                            selected: true,
                            order: 5
                        },
                        invites: {
                            name: 'invites',
                            pinned: false,
                            selected: true,
                            order: 6
                        },
                        reactions: {
                            name: 'reactions',
                            pinned: false,
                            selected: true,
                            order: 7
                        },
                        reports: {
                            name: 'reports',
                            pinned: false,
                            selected: true,
                            order: 8
                        },
                        votes: {
                            name: 'votes',
                            pinned: false,
                            selected: true,
                            order: 9
                        },
                        check: {
                            name: 'check',
                            pinned: false,
                            selected: true,
                            order: 10
                        }
                    },
                    filters: {
                        isFiltered: false,
                        status: {
                            new: {
                                name: 'new',
                                selected: false,
                            },
                            active: {
                                name: 'active',
                                selected: false,
                            },
                            floodWait: {
                                name: 'floodWait',
                                selected: false,
                            },
                            floodBan: {
                                name: 'floodBan',
                                selected: false,
                            },
                            ban: {
                                name: 'ban',
                                selected: false,
                            },
                        }
                    }
                }
            }
        }
    }
}
