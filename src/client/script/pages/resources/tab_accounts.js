app.pages.resources.tabs.accounts = {
    render: () => {

        const table = $('<DIV/>', { class: 'table resource_table' });
        table.append(
            app.pages.resources.tabs.accounts.header.render(),
            app.pages.resources.tabs.accounts.body.render(),
            app.pages.resources.tabs.accounts.footer.render(),
        )

        $('.content_body').append( table )

        if (resources.accounts.length) {

            // пересчитываем ширину ячеек
            app.pages.resources.tabs.accounts.body.colSort($('.table_caption .pinned_inner'), $('.table_caption .pinned_inner .table_cell'));
            app.pages.resources.tabs.accounts.body.colSort($('.table_caption'), $('.table_caption > .table_cell'));
            $('.table_row').each((i, item) => {
                app.pages.resources.tabs.accounts.body.colSort($(item).find('.pinned_inner'), $(item).find('.pinned_inner .table_cell'));
                app.pages.resources.tabs.accounts.body.colSort($(item), $(item).find('> .table_cell'));
            })

            app.pages.resources.tabs.accounts.body.colCalcWidth();

            app.pages.resources.tabs.accounts.header.filter.filtering(state.params.pages.resources.tabs.accounts.filters)

        }
    },
    header: {
        render: () => {
            const tableHeader = $('<DIV/>', { class: 'table_header' });
            const tableHeaderRow1 = $('<DIV/>', { class: 'table_header_row' });

            tableHeaderRow1.append(
                app.pages.resources.tabs.accounts.addAccounts.btn.render(),
                app.pages.resources.tabs.accounts.header.search.render(),
                app.pages.resources.tabs.accounts.header.filter.btn.render(),
                app.pages.resources.tabs.accounts.header.columns.btn.render()
            )

            const tableHeaderRow2 = $('<DIV/>', { class: 'table_header_row' });
            const btnCreateGroup = $('<DIV/>', { class: 'button button-create-group' }).append(
                svg.icon.plus,
                $('<SPAN/>', { text: lang.pages.resources.tabs.accounts.table.header.buttons.createGroup }),
                svg.icon.premium
            );
            const groups = $('<DIV/>', { class: 'table_groups' });
            const btnAddToGroup = $('<DIV/>', { class: 'button button-add-to-group', html: svg.icon.add, title: lang.pages.resources.tabs.accounts.table.header.actions.addToGroup });
            tableHeaderRow2.append(
                btnCreateGroup,
                groups.append( app.pages.resources.tabs.accounts.header.groups.render(['Группа 1','Группа 2', 'Группа 3', 'Группа 4']) ),
                btnAddToGroup,
                app.pages.resources.tabs.accounts.header.removeAll.btn.render(),
                app.pages.resources.tabs.accounts.header.checkAll.btn.render()
            )

            tableHeader.append(
                tableHeaderRow1,
                // tableHeaderRow2
            )

            return tableHeader;

        },
        columns: {
            btn: {
                render: () => {
                    return elements.button({
                        class: 'button-columns',
                        icon: svg.icon.columns,
                        title: lang.pages.resources.tabs.accounts.table.header.columns.button
                    })
                        .on('click', app.pages.resources.tabs.accounts.header.columns.popup.render )

                }
            },
            popup: {
                render: () => {
                    // Делаем копи объекта, что бы можно было по нему создать данные, но при изменении селекта,
                    // не менялся стейт, до явного сохранения по кнопке пользователем
                    const items = JSON.parse(JSON.stringify( state.params.pages.resources.tabs.accounts.columns ));


                    let wrap = $('<DIV/>', { class: 'items' });
                    let pinned = $('<DIV/>', { class: 'items_pinned columns-sortable' });
                    let unpinned = $('<DIV/>', { class: 'items_unpinned columns-sortable' });


                    for (const key in items ) {
                        let item = items[ key ];
                        if ( key !== 'select' ) {
                            if (item.pinned) {
                                pinned.append( app.pages.resources.tabs.accounts.header.columns.popup.item.render(item) )
                            } else {
                                unpinned.append( app.pages.resources.tabs.accounts.header.columns.popup.item.render(item) )
                            }
                        }
                    }

                    let saveButton = $('<DIV/>', { class: 'button', text: lang.pages.resources.tabs.accounts.table.header.columns.popup.buttons.save })
                        .on('click', () => { app.pages.resources.tabs.accounts.header.columns.popup.save( items, wrap ) })


                    wrap.append(
                        $('<DIV/>', { class: 'items_title', text: lang.pages.resources.tabs.accounts.table.header.columns.popup.columns.pinned }),
                        pinned,
                        $('<DIV/>', { class: 'items_title', text: lang.pages.resources.tabs.accounts.table.header.columns.popup.columns.unpinned }),
                        unpinned,
                    )


                    elements.popup.create('side', {
                        title: lang.pages.resources.tabs.accounts.table.header.columns.popup.title,
                        body: wrap,
                        actions: saveButton,
                        saveFn: () => {
                            app.pages.resources.tabs.accounts.header.columns.popup.save( items, wrap )
                        }
                    })

                    // сортируем отрендеренные строки в соответствии с их порядком
                    let pinnedItemsList = $(".items_pinned .item");
                    pinnedItemsList.sort(function(a, b){
                        return $(a).data('order')-$(b).data('order')
                    });
                    $('.items_pinned').append(pinnedItemsList);

                    let unpinnedItemsList = $(".items_unpinned .item");
                    unpinnedItemsList.sort(function(a, b){
                        return $(a).data('order')-$(b).data('order')
                    });
                    $('.items_unpinned').append(unpinnedItemsList);


                    // Добавляем возможность сортировки
                    $('.items_pinned, .items_unpinned')
                        .sortable({
                            connectWith: ".columns-sortable",
                            handle: ".item_drag"
                        })
                        .disableSelection();
                },
                item: {
                    render: ( item ) => {
                        const wrap = $('<DIV/>', { class: 'item' + (item.selected ? ' selected' : ''), 'data-item': item.name, 'data-order': item.order });
                        const drag = $('<DIV/>', { class: 'item_drag', html: svg.drag });
                        const title = $('<DIV/>', { class: 'item_title', text: lang.pages.resources.tabs.accounts.table.caption[ item.name ] });
                        const select = $('<DIV/>', { class: 'checkbox', html: svg.check });

                        select.on('click', function() { app.pages.resources.tabs.accounts.header.columns.popup.item.select( $(this), item ) })

                        return wrap.append(
                            drag,
                            title,
                            item.name !== 'check' ? select : ''
                        )

                    },
                    select: (el, item) => {
                        item.selected = !item.selected;
                        el.parent().toggleClass('selected');
                    }
                },
                save: ( items, wrap ) => {

                    wrap.find('.items_pinned .item').each((i, item) => {
                        items[ $(item).attr('data-item') ].order = i;
                        items[ $(item).attr('data-item') ].pinned = true;
                    })
                    wrap.find('.items_unpinned .item').each((i, item) => {
                        items[ $(item).attr('data-item') ].order = i;
                        items[ $(item).attr('data-item') ].pinned = false;
                    })

                    state.params.pages.resources.tabs.accounts.columns = items;
                    localStorage.setItem('params', JSON.stringify( state.params ));
                    app.pages.resources.tabs.accounts.body.colUpdate()
                    elements.popup.destroy()
                }
            }
        },
        filter: {
            btn: {
                render: () => {

                    let button = elements.button({ class: 'button-filter' });
                    button.on('click', app.pages.resources.tabs.accounts.header.filter.popup.render )

                    if ( state.params.pages.resources.tabs.accounts.filters.isFiltered ) {
                        app.pages.resources.tabs.accounts.header.filter.btn.filtered( button )
                    } else {
                        app.pages.resources.tabs.accounts.header.filter.btn.clear( button )
                    }

                    return button;
                },
                filtered: (button) => {
                    button
                        .addClass('button--primary')
                        .html( svg.icon.filterEdit )
                        .attr('title', lang.pages.resources.tabs.accounts.table.header.filter.selectedButton)
                },
                clear: (button) => {
                    button
                        .removeClass('button--primary')
                        .html( svg.icon.filter )
                        .attr('title', lang.pages.resources.tabs.accounts.table.header.filter.button)
                }
            },
            popup: {
                render: () => {
                    const wrap = $('<DIV/>', { class: 'items' });
                    const actionButton = $('<DIV/>', { class: 'button' });
                    const status = $('<DIV/>', { class: 'items_status' }).append(
                        $('<DIV/>', { class: 'items_title', text: lang.pages.resources.tabs.accounts.table.header.filter.popup.filters.status.title }),
                    );
                    const proxy = $('<DIV/>', { class: 'items_proxy' });


                    const filterState = JSON.parse( JSON.stringify( state.params.pages.resources.tabs.accounts.filters ) );

                    for ( const key in filterState.status ) {
                        status.append( app.pages.resources.tabs.accounts.header.filter.popup.statusRow.render( filterState.status[ key ], actionButton, filterState ) );
                    }


                    if ( !filterState.isFiltered ) {
                        actionButton
                            .text( lang.pages.resources.tabs.accounts.table.header.filter.popup.buttons.apply )
                            .on('click.apply', () => { app.pages.resources.tabs.accounts.header.filter.filtering( filterState ) })
                    } else {
                        actionButton
                            .text( lang.pages.resources.tabs.accounts.table.header.filter.popup.buttons.clear )
                            .on('click.clear', () => { app.pages.resources.tabs.accounts.header.filter.clear( filterState ) })
                    }



                    wrap.append(
                        status,
                        proxy,
                        actionButton
                    )

                    elements.popup.create('side', {
                        title: lang.pages.resources.tabs.accounts.table.header.filter.popup.title,
                        body: wrap,
                        actions: actionButton,
                        saveFn: () => {
                            app.pages.resources.tabs.accounts.header.columns.popup.save( items, wrap )
                        }
                    })

                },
                statusRow: {
                    render: ( item, button, state ) => {
                        const wrap = $('<DIV/>', { class: 'item' + (item.selected ? ' selected' : ''), 'data-item': item.name });
                        const select = $('<DIV/>', { class: 'checkbox', html: svg.check });
                        const title = $('<DIV/>', { class: 'item_title', text: lang.pages.resources.tabs.accounts.table.header.filter.popup.filters.status.options[ item.name ] });

                        wrap.on('click', function() { app.pages.resources.tabs.accounts.header.filter.popup.statusRow.select( $(this), item, button, state ) })

                        return wrap.append(
                            item.name !== 'check' ? select : '',
                            title
                        )

                    },
                    select: (el, item, button, state) => {

                        button
                            .off('click.clear')
                            .text( lang.pages.resources.tabs.accounts.table.header.filter.popup.buttons.apply )
                            .on('click.apply', () => { app.pages.resources.tabs.accounts.header.filter.filtering( state ) })


                        item.selected = !item.selected;
                        el.toggleClass('selected');
                    }
                }
            },
            filtering: (params) => {

                params.isFiltered = false;
                for (const key in params.status ) {
                    if ( params.status[ key ].selected ) {
                        params.isFiltered = true;
                    }
                }
                if ( params.isFiltered ) {

                    app.pages.resources.tabs.accounts.header.filter.btn.filtered( $('.table_header .button-filter') )

                   let counter = 0;
                    resources.accounts.forEach(account => {
                        account.render.row.filtered = false;

                        for (const key in params.status) {
                            if ( params.status[key].selected ) {
                                if ( account.status.toLowerCase() === key ) {
                                    account.render.row.filtered = true;
                                    counter++;
                                }
                            }
                        }

                    })

                } else {

                    params.isFiltered = false;
                    for (const key in params.status ) {
                        params.status[ key ].selected = false;
                    }

                    resources.accounts.forEach(( account, i ) => {
                        account.render.row.filtered = false;
                    })


                }


                $('.table_header_row .button-check').remove();
                $('.table_header_row .button-remove').remove();

                state.params.pages.resources.tabs.accounts.filters = params;
                localStorage.setItem('params', JSON.stringify(state.params));
                elements.popup.destroy();


                app.pages.resources.tabs.accounts.footer.pagination.update( $('.pagination') );

            },
            clear: (params) => {
                params.isFiltered = false;
                for (const key in params.status ) {
                    params.status[ key ].selected = false;
                }

                app.pages.resources.tabs.accounts.header.filter.btn.clear( $('.table_header .button-filter') )

                resources.accounts.forEach( account => {
                    account.render.row.filtered = false;
                })


                $('.table_header_row .button-check').remove();
                $('.table_header_row .button-remove').remove();

                state.params.pages.resources.tabs.accounts.filters = params;
                localStorage.setItem('params', JSON.stringify( state.params ));
                elements.popup.destroy();


                app.pages.resources.tabs.accounts.footer.pagination.update( $('.pagination') );

            }
        },
        groups: {
            render: (groups) => {
                let blocks = [];
                groups.forEach(group => {
                    blocks.push(
                        $('<DIV/>', { class: 'group', text: group })
                            .on('click', function() { app.pages.resources.tabs.accounts.header.groups.filter($(this)) } )
                    );
                })
                return blocks
            },
            filter: (el) => {
                el.toggleClass('active')
            }
        },
        search: {
            render: () => {
                const search = $('<DIV/>', { class: 'table_search' }).append(
                    svg.icon.search,
                    $('<INPUT/>', { type: 'search', placeholder: lang.pages.resources.tabs.accounts.table.header.search } )
                        .on('input paste', function() { app.pages.resources.tabs.accounts.header.search.search($(this)) })
                )

                return search
            },
            search: (input) => {
                let request = input.val();
                if ( request ) {
                    $('.table_content .table_row').addClass('hide')
                    $('.table_content .table_row').each((i, item) => {
                        if ( $(item).find('.cell-name').text().toLowerCase().indexOf(request) !== -1
                            || $(item).find('.cell-id').text().toLowerCase().indexOf(request) !== -1 ) {
                            $(item).removeClass('hide');
                        }
                    })
                } else {
                    $('.table_content .table_row').removeClass('hide');
                }
            }
        },
        checkAll: {
            btn: {
                render: () => {
                    return elements.button({
                        class: 'button-check',
                        icon: svg.icon.check,
                        title: lang.pages.resources.tabs.accounts.table.header.actions.check
                    })
                }
            }
        },
        removeAll: {
            btn: {
                render: () => {
                    return elements.button({
                        class: 'button-remove',
                        icon: svg.icon.remove,
                        title: lang.pages.resources.tabs.accounts.table.header.actions.remove
                    })
                }
            }
        }
    },
    body: {
        render: () => {

            const tableBody = $('<DIV/>', { class: 'table_body' });
            const tableContent = $('<DIV/>', { class: 'table_content' });

            const tableNothing = $('<DIV/>', { class: 'table_body_nothing' }).append(
                app.pages.resources.tabs.accounts.addAccounts.btn.render()
            );

            if ( !resources.accounts.length ) {
                tableBody.append( tableNothing )
            } else {

                tableBody.append(
                    tableContent.append(
                        app.pages.resources.tabs.accounts.body.caption.render(),
                    )
                )

                resources.accounts.forEach((account, i) => {
                    if ( !account.render ) {
                        account.render = {
                            row: {
                                filtered: false,
                                show: true,
                                selected: false,
                                el: null,
                                set visability(value) {
                                    if (value) {
                                        this.show = true;
                                        this.el.removeClass('hide')
                                    } else {
                                        this.show = false;
                                        this.el.addClass('hide')
                                    }
                                },
                                set select(value) {
                                    if (value) {
                                        this.selected = true;
                                        this.el.addClass('selected')
                                    } else {
                                        this.selected = false;
                                        this.el.removeClass('selected');
                                        this.el.closest('.table_content').find('.checkbox-all').removeClass('selected')
                                    }
                                }
                            }
                        };
                    }
                    account.render.row.el = app.pages.resources.tabs.accounts.body.rows.render( account );

                    tableBody.append(
                        tableContent.append(
                            account.render.row.el
                        )
                    )

                    if ( i + 1 > state.params.pages.resources.tabs.accounts.rowsOnPage ) {
                        account.render.row.visability = false;
                    }
                })


                tableBody.scroll(() => {
                    if ( tableBody.scrollLeft() > 3 ) {
                        tableBody.addClass('scrolled')
                    } else {
                        tableBody.removeClass('scrolled')
                    }
                })
            }

            return tableBody;
        },
        caption: {
            render: () => {
                const tableCaption = $('<DIV/>', { class: 'table_caption' });
                const tableCaptionPinned = $('<DIV/>', { class: 'pinned' }).append(
                    $('<DIV/>', { class: 'pinned_inner' })
                );

                let items = state.params.pages.resources.tabs.accounts.columns;

                for (const key in items) {
                    let item = items[key];
                    if ( item.selected ) {
                        if (item.pinned) {
                            tableCaptionPinned.find('.pinned_inner').append(
                                app.pages.resources.tabs.accounts.body.caption.columns[item.name].render(item)
                            )
                        } else {
                            tableCaption.append(
                                app.pages.resources.tabs.accounts.body.caption.columns[item.name].render(item)
                            )
                        }
                    }
                }

                tableCaption.prepend( tableCaptionPinned );

                return tableCaption;
            },
            columns: {
                select: {
                    render: () => {
                        return $('<DIV/>', { class: 'table_cell cell-select', 'data-order': 0 }).append(
                            $('<DIV/>', { class: 'checkbox-all' })
                                .append( svg.check )
                                .on('click', function () {
                                    if ( $(this).closest('.checkbox-all').hasClass('selected') ) {
                                        $(this).closest('.checkbox-all').removeClass('selected')
                                        resources.accounts.forEach((account, i) => {
                                            account.render.row.select = false
                                        })

                                        $('.table_header_row .button-check').remove();
                                        $('.table_header_row .button-remove').remove();
                                    } else {
                                        $(this).closest('.checkbox-all').addClass('selected')
                                        resources.accounts.forEach((account, i) => {
                                            if (account.render.row.show) {
                                                account.render.row.select = true
                                            }
                                        })
                                        if (!$('.table_header_row .button-remove').length && !$('.table_header_row .button-check').length ) {
                                            $('.table_header_row:first-child').append(
                                                app.pages.resources.tabs.accounts.header.removeAll.btn.render(),
                                                app.pages.resources.tabs.accounts.header.checkAll.btn.render()
                                            )
                                        }
                                    }

                                })

                        );
                    },
                },
                id: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-id', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.id });
                    }
                },
                status: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-status', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.status });
                    }
                },
                name: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-name', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.name });
                    }
                },
                floodTime: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-floodTime', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.floodTime });
                    }
                },
                proxy: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-proxy', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.proxy });
                    }
                },
                group: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-group', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.group });
                    }
                },
                actions: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-actions', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.actions })
                    }
                },
                messages: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-messages', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.messages });
                    }
                },
                invites: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-invites', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.invites })
                    }
                },
                reactions: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-reactions', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.reactions })
                    }
                },
                reports: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-reports', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.reports })
                    }
                },
                votes: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-votes', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.caption.votes })
                    }
                },
                check: {
                    render: (item) => {
                        return $('<DIV/>', { class: 'table_cell cell-check', 'data-order': item.order })
                    }
                }
            }
        },
        rows: {
            render: (account) => {
                let items = state.params.pages.resources.tabs.accounts.columns;

                let row = $('<DIV/>', {class: 'table_row status-' + account.status.toLowerCase()})
                let rowPinnedCols = $('<DIV/>', {class: 'pinned'}).append(
                    $('<DIV/>', {class: 'pinned_inner'})
                );

                for (const key in items) {
                    let item = items[key];
                    if (item.selected) {
                        if (item.pinned) {
                            rowPinnedCols.find('.pinned_inner').append(
                                app.pages.resources.tabs.accounts.body.rows.columns[item.name].render(item, account)
                            )
                        } else {
                            row.append(
                                app.pages.resources.tabs.accounts.body.rows.columns[item.name].render(item, account)
                            )
                        }
                    }
                }

                row.prepend(rowPinnedCols)

                return row;
            },
            columns: {
                select: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-select', 'data-order': 0 }).append(
                            $('<DIV/>', { class: 'checkbox' })
                                .append( svg.check )
                                .on('click', function() {
                                    account.render.row.select = !account.render.row.selected;

                                    if ( account.render.row.selected ) {

                                        if ( !$('.table_header_row .button-remove').length && !$('.table_header_row .button-check').length ) {
                                            $('.table_header_row:first-child').append(
                                                app.pages.resources.tabs.accounts.header.removeAll.btn.render(),
                                                app.pages.resources.tabs.accounts.header.checkAll.btn.render()
                                            )
                                        }

                                    } else {
                                        let select = false;
                                        resources.accounts.forEach((account, i) => {
                                            if ( account.render.row.selected ) {
                                                select = true;
                                            }
                                        })

                                        if ( !select ) {
                                            $('.table_header_row .button-check').remove();
                                            $('.table_header_row .button-remove').remove();
                                        }
                                    }

                                })
                        )
                    }
                },
                id: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-id', 'data-order': item.order, text: account._id })
                    }
                },
                status: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-status', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.rows.statuses[ account.status.toLowerCase() ] });
                    }
                },
                name: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-name', 'data-order': item.order, text: account.config.name }).on('click', app.pages.resources.tabs.accounts.body.rows.columns.name.change)
                    },
                    change: () => {
                        console.log('Заглушка: Попап с инпутом для смены имени')
                    },
                },
                floodTime: {
                    render: (item, account) => {
                        const floodTimeCol = $('<DIV/>', { class: 'table_cell cell-floodTime', 'data-order': item.order });
                        if ( account.banTime ) {
                            floodTimeCol.text(
                                app.pages.resources.tabs.accounts.body.rows.columns.floodTime.convertTime( account.banTime )
                            )
                        }
                        return floodTimeCol
                    },
                    convertTime: ( time ) => {
                        let hours, minutes;
                        if ( time.minutes && time.minutes !== 0 ) {
                            hours = time.hours;
                            minutes = time.minutes < 10 ? '0' + time.minutes : time.minutes;
                            return hours + ':' + minutes;
                        } else {
                            return time.hours + lang.helpers.shortDate.hours;
                        }
                    }
                },
                proxy: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-proxy' + ( account.proxy ? ' added' : '' ), 'data-order': item.order, text: account.proxy.title ? account.proxy.title : lang.pages.resources.tabs.accounts.table.rows.addProxy })
                            .on('click', app.pages.resources.tabs.accounts.body.rows.columns.proxy.change);
                    },
                    change: () => {
                        console.log('Заглушка: Попап с селектом прокси')
                    },
                },
                group: {
                    render: (item, account) => {
                        let groupCol = $('<DIV/>', { class: 'table_cell cell-group', 'data-order': item.order});
                        if ( account.group ) {
                            groupCol
                                .addClass('added')
                                .attr('data-id', account.group.id)
                                .text(account.group.title)
                                .on('click', () => { app.pages.resources.tabs.accounts.body.rows.columns.group.change( account.group ) })
                        } else {
                            groupCol
                                .text( lang.pages.resources.tabs.accounts.table.rows.addToGroup )
                                .on('click', () => { app.pages.resources.tabs.accounts.body.rows.columns.group.change() })
                        }
                        return groupCol;

                    },
                    change: ( group ) => {

                        if ( group ) {
                            console.log('Заглушка: Удаление из группы', group.id, group.title)
                        } else {
                            console.log('Заглушка: Добавление в группу')
                        }

                    }
                },
                actions: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-actions', 'data-order': item.order, text: lang.pages.resources.tabs.accounts.table.rows.actions.show });
                    }
                },
                messages: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-messages', 'data-order': item.order, text: account.stats.messages.sent });
                    }
                },
                invites: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-invites', 'data-order': item.order, text: account.stats.invites.sent });
                    }
                },
                reactions: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-reactions', 'data-order': item.order, text: account.stats.reactions.sent });
                    }
                },
                reports: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-reports', 'data-order': item.order, text: account.stats.reports.sent });
                    }
                },
                votes: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-votes', 'data-order': item.order, text: account.stats.votes.sent });
                    }
                },
                check: {
                    render: (item, account) => {
                        return $('<DIV/>', { class: 'table_cell cell-check', 'data-order': item.order})
                            .append( svg.icon.check )
                            .on('click', () => { app.pages.resources.tabs.accounts.body.rows.columns.check.check( account.id ) })
                    },
                    check: (account) => {
                        console.log('Заглушка: проверка аккаунта', account.id);
                    },
                }
            }
        },
        colSort: (parent, els) => {
            els.sort(function(a, b){
                return $(a).data('order')-$(b).data('order')
            });
            parent.append(els);
        },
        colCalcWidth: () => {
            let cellNames = [];
            let items = state.params.pages.resources.tabs.accounts.columns;
            for (const key in items) {
                if ( items[key].selected ) {
                    cellNames.push(items[key].name)
                }
            }

            // Так как есть запиненые столбцы, у них не выставляется ширина по самой широкой ячейке в столбце, делаем это руками
            cellNames.forEach(name => {
                let maxSize = 0;
                let cells = $('.cell-' + name);
                cells.each((i, div) => {
                    if ( maxSize < $(div).width() ) {
                        maxSize = $(div).width();
                    }
                })
                let size = maxSize + +cells.css('paddingLeft').slice(0, -2) + +cells.css('paddingRight').slice(0, -2);
                cells.css('minWidth', Math.round(size))
            })

            // Так же считаем ширину для запиненой ячейки с ячейками
            let pinnedWidth = 0;
            $('.table_caption .pinned:first-child .pinned_inner').children('div').each((i, div) => {
                pinnedWidth += $(div).width() + +$(div).css('paddingLeft').slice(0, -2) + +$(div).css('paddingRight').slice(0, -2);
            })
            $('.pinned').css('width', pinnedWidth + 'px')
        },
        colUpdate: () => {
            $('.table_body').remove();
            $('.table_header').after(
                app.pages.resources.tabs.accounts.body.render()
            )

            app.pages.resources.tabs.accounts.body.colSort($('.table_caption .pinned_inner'), $('.table_caption .pinned_inner .table_cell'));
            app.pages.resources.tabs.accounts.body.colSort($('.table_caption'), $('.table_caption > .table_cell'));
            $('.table_row').each((i, item) => {
                app.pages.resources.tabs.accounts.body.colSort($(item).find('.pinned_inner'), $(item).find('.pinned_inner .table_cell'));
                app.pages.resources.tabs.accounts.body.colSort($(item), $(item).find('> .table_cell'));
            })

            app.pages.resources.tabs.accounts.body.colCalcWidth();

            app.pages.resources.tabs.accounts.header.filter.filtering(state.params.pages.resources.tabs.accounts.filters)

        }
    },
    footer: {
        render: () => {
            const tableFooter = $('<DIV/>', { class: 'table_footer' });

            tableFooter.append(
                app.pages.resources.tabs.accounts.footer.rowsOnPage.render(),
                app.pages.resources.tabs.accounts.footer.pagination.render(),
                app.pages.resources.tabs.accounts.footer.total.render(1, resources.accounts.length)
            )

            return tableFooter;
        },
        rowsOnPage: {
            render: () => {
                const rowsOnPage = $('<DIV/>', { class: 'rows-on-page' });
                const rowsOnPageTitle = $('<DIV/>', { class: 'rows-on-page_title', text: lang.pages.resources.tabs.accounts.table.footer.rowsOnPage });
                const rowsOnPageSelect = $('<DIV/>', { class: 'rows-on-page_select' }).on('click', function() { $(this).find('.rows-on-page_options').slideToggle(300); $(this).toggleClass('active') });
                const rowsOnPageSelectResult = $('<DIV/>', { class: 'rows-on-page_result', text: state.params.pages.resources.tabs.accounts.rowsOnPage })
                const rowsOnPageSelectOptions = $('<DIV/>', { class: 'rows-on-page_options' }).append(
                    $('<DIV/>', { text: '20' }).on('click', () => { app.pages.resources.tabs.accounts.footer.rowsOnPage.change(20, rowsOnPageSelectResult) }),
                    $('<DIV/>', { text: '50' }).on('click', () => { app.pages.resources.tabs.accounts.footer.rowsOnPage.change(50, rowsOnPageSelectResult) }),
                    $('<DIV/>', { text: '100' }).on('click', () => { app.pages.resources.tabs.accounts.footer.rowsOnPage.change(100, rowsOnPageSelectResult) }),
                    $('<DIV/>', { text: '250' }).on('click', () => { app.pages.resources.tabs.accounts.footer.rowsOnPage.change(250, rowsOnPageSelectResult) }),
                    $('<DIV/>', { text: '500' }).on('click', () => { app.pages.resources.tabs.accounts.footer.rowsOnPage.change(500, rowsOnPageSelectResult) }),
                    $('<DIV/>', { text: '1000' }).on('click', () => { app.pages.resources.tabs.accounts.footer.rowsOnPage.change(1000, rowsOnPageSelectResult) })
                );

                return rowsOnPage.append(
                    rowsOnPageTitle,
                    rowsOnPageSelect.append(
                        rowsOnPageSelectOptions,
                        rowsOnPageSelectResult,
                        svg.arrows.tableSelect
                    )
                )
            },
            change: (sum, resultEl) => {
                // меняем кофиг
                state.params.pages.resources.tabs.accounts.rowsOnPage = sum;
                localStorage.setItem('params', JSON.stringify( state.params ))
                resultEl.text( state.params.pages.resources.tabs.accounts.rowsOnPage )

                $('.table_header_row .button-check').remove();
                $('.table_header_row .button-remove').remove();

                app.pages.resources.tabs.accounts.body.colUpdate();
                app.pages.resources.tabs.accounts.footer.pagination.update( $('.pagination') );
            }
        },
        pagination: {
            render: () => {
                return $('<DIV/>', { class: 'pagination'});
            },
            update: ( pagination ) => {
                pagination.find('.pagination_page').remove();

                let accounts = [];
                if ( state.params.pages.resources.tabs.accounts.filters.isFiltered ) {
                    resources.accounts.forEach(account => {
                        if ( account.render.row.filtered ) {
                            accounts.push(account);
                        }
                        account.render.row.visability = false;
                        account.render.row.select = false;
                    })
                } else {
                    accounts = resources.accounts;
                }



                const rowsOnPage = state.params.pages.resources.tabs.accounts.rowsOnPage;
                let pageCount = Math.ceil( accounts.length / state.params.pages.resources.tabs.accounts.rowsOnPage )


                accounts.forEach((account, accountIndex) => {
                    account.render.row.select = false;

                    if ( accountIndex <= rowsOnPage - 1 ) {
                        account.render.row.visability = true;
                    } else {
                        account.render.row.visability = false;
                    }
                })

                app.pages.resources.tabs.accounts.footer.total.update(accounts.length, 1)


                for (let i = 1; i < pageCount + 1; i++) {
                    let pageButton = $('<BUTTON/>', { class: 'pagination_page', text: i })
                    if ( i === 1 ) {
                        pageButton.addClass('active')
                    }

                    pageButton.on('click', function () {
                        $('.pagination_page').removeClass('active');
                        $(this).addClass('active')

                        accounts.forEach((account, accountIndex) => {
                            account.render.row.select = false;

                            if ( accountIndex >= ((i - 1) * rowsOnPage) && accountIndex < ( i * rowsOnPage ) ) {
                                account.render.row.visability = true;
                            } else {
                                account.render.row.visability = false;
                            }
                        })

                        app.pages.resources.tabs.accounts.footer.total.update(accounts.length, i)

                        $('.table_header_row .button-check').remove();
                        $('.table_header_row .button-remove').remove();
                    })
                    pagination.append( pageButton )

                }
            }
        },
        total: {
            render: (total, page) => {
                let text;

                if ( total === 0 ) {
                    text = '0 ' + lang.pages.resources.tabs.accounts.table.footer.of + ' 0';
                } else {
                    if ( total < state.params.pages.resources.tabs.accounts.rowsOnPage ) {
                        text = total + ' ' + lang.pages.resources.tabs.accounts.table.footer.of + ' ' + total;
                    } else {
                        let first, second;
                        if ( page === 1 ) {
                            first = 1;
                            second = state.params.pages.resources.tabs.accounts.rowsOnPage;
                        } else {
                            first = ( page - 1 ) * state.params.pages.resources.tabs.accounts.rowsOnPage + 1;
                            second = page * state.params.pages.resources.tabs.accounts.rowsOnPage
                        }
                        if ( page * state.params.pages.resources.tabs.accounts.rowsOnPage > total ) {
                            second = total
                        }

                        text = first + ' - ' + second + ' ' + lang.pages.resources.tabs.accounts.table.footer.of + ' ' + total;
                    }
                }

                return $('<DIV/>', {
                    class: 'total',
                    text: text
                });
            },
            update: (first, total) => {
                let totalEl = $('.table_footer .total');
                totalEl.after( app.pages.resources.tabs.accounts.footer.total.render(first, total) );
                totalEl.remove();
            },
            reset: () => {
                app.pages.resources.tabs.accounts.footer.total.update(1, resources.accounts.length);
            }
        }
    },
    addAccounts: {
        btn: {
            render: () => {
                return btnAddAccounts = $('<DIV/>', { class: 'button button--primary button-add-accounts' })
                    .append(
                        svg.icon.plus,
                        $('<SPAN/>', { text: lang.pages.resources.tabs.accounts.table.header.buttons.addAccounts })
                    )
                    .on('click', app.pages.resources.tabs.accounts.addAccounts.popup.render)
            }
        },
        popup: {
            render: () => {
                const content = $('<DIV/>', { class: 'accounts' });
                const tabs = $('<DIV/>', { class: 'accounts_tabs' });
                tabs.append(
                    $('<DIV/>', { class: 'accounts_tab active', text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.title })
                        .on('click', function () { app.pages.resources.tabs.accounts.addAccounts.popup.changeTab($(this), 'tdata') }),
                    $('<DIV/>', { class: 'accounts_tab', text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.session.title })
                        .on('click', function () { app.pages.resources.tabs.accounts.addAccounts.popup.changeTab($(this), 'session') }),
                    $('<DIV/>', { class: 'accounts_tab', text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.sms.title })
                        .on('click', function () { app.pages.resources.tabs.accounts.addAccounts.popup.changeTab($(this), 'sms') })
                )

                content.append(
                    tabs,
                    app.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.render(),
                    app.pages.resources.tabs.accounts.addAccounts.popup.tabs.session.render(),
                    app.pages.resources.tabs.accounts.addAccounts.popup.tabs.sms.render()
                )

                elements.popup.create('center', {
                    title: lang.pages.resources.tabs.accounts.addAccounts.popup.title,
                    body: content,
                    callback: () => {
                        // удаляем слушатели при закрытии попапа
                        ipcRenderer.removeListener('addAccounts_tdata_res', app.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.result)
                    }
                })

                // Включаем слушатель на добавление tdata
                ipcRenderer.on('addAccounts_tdata_res', app.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.result)
            },
            changeTab: (el, tab) => {
                el.parent().find('.accounts_tab').removeClass('active');
                el.addClass('active');
                el.closest('.accounts').find('.accounts_tab-content').removeClass('active')
                el.closest('.accounts').find('.accounts_tab-content.tab-' + tab).addClass('active');
            },
            tabs: {
                tdata: {
                    render: () => {
                        const content = $('<DIV/>', { class: 'accounts_tab-content tab-tdata active' });
                        const text = $('<P/>', { text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.description });
                        const password = $('<DIV/>', { class: 'tab-tdata_2fa' }).append(
                            $('<INPUT/>', { type: 'text', placeholder: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.input }),
                            $('<DIV/>', { class: 'tab-tdata_coming', text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.comingSoon })
                        )
                        const api = $('<INPUT/>', { class: 'tab-tdata_api', placeholder: 'Custom Api id:hash 18599751:6d3f9221b64c3b3e067add33ad58f416' })
                        const button = elements.button({
                            primary: true,
                            class: 'tab-tdata_button',
                            text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.button.selectFolder,
                            loader: true
                        });

                        button.on('click.add', () => {
                            ipcRenderer.send('addAccounts_tdata_req', { api: api.val(), token: localStorage.getItem('token') });
                            button
                                .addClass('loading')
                                .off('click.add')
                        });

                        return content.append(
                            text,
                            api,
                            password,
                            button
                        )
                    },
                    result: (evt, data) => {
                        if ( data.empty ) {
                            $('.accounts_tab-content .tab-tdata_button')
                                .removeClass('loading')
                                .on('click.add', () => {
                                    ipcRenderer.send('addAccounts_tdata_req', { api: $('.accounts_tab-content .tab-tdata_api').val() });
                                    $('.accounts_tab-content .tab-tdata_button')
                                        .addClass('loading')
                                        .off('click.add')
                                });
                        } else {
                            let content = $('.accounts_tab-content.tab-tdata');

                            content.find('*').remove();

                            if ( !data.added && !data.error.length ) {
                                content.addClass('added')
                                const nothing = $('<P/>', { class: 'tab_added', html: lang.pages.resources.tabs.accounts.addAccounts.popup.added.nothing })
                                content.append( nothing )
                            }

                            if ( data.added ) {
                                content.addClass('added')
                                const added = $('<P/>', { class: 'tab_added', html: utils.declOfNum(data.added.length, lang.pages.resources.tabs.accounts.addAccounts.popup.added.success ) + '&nbsp;<b>' + data.added.length + '</b>&nbsp;' + utils.declOfNum(data.added.length, lang.pages.resources.tabs.accounts.addAccounts.popup.added.accounts ) })
                                content.append( added )

                                data.added.forEach(account => {
                                    resources.accounts.push( account )
                                })

                                app.pages.resources.tabs.accounts.body.colUpdate();

                            }

                            if ( data.error.length ) {
                                content.removeClass('added')
                                const errors = $('<DIV/>', { class: 'tab_errors' }).append(  );
                                const errorsTitle = $('<DIV/>', { class: 'tab_errors_title', text: lang.pages.resources.tabs.accounts.addAccounts.popup.added.errors.title });
                                const errorsContent = $('<DIV/>', { class: 'tab_errors_content' });
                                data.error.forEach(item => {
                                    let row = $('<DIV/>', { class: 'tab_errors_item' } );
                                    let status = $('<DIV/>', { class: 'tab_errors_item_status' } );
                                    let text = $('<DIV/>', { class: 'tab_errors_item_text', text: item.path } );
                                    if ( item.type === 'bad' ) {
                                        status.addClass('item-status-error')
                                        status.text( lang.pages.resources.tabs.accounts.addAccounts.popup.added.errors.bad )
                                    }
                                    if ( item.type === 'double' ) {
                                        status.addClass('item-status-warning')
                                        status.text( lang.pages.resources.tabs.accounts.addAccounts.popup.added.errors.double )
                                    }
                                    errorsContent.append(
                                        row.append( status, text )
                                    )
                                })

                                content.append( errors.append( errorsTitle, errorsContent ) )
                            }

                            const button = elements.button({ text: lang.pages.resources.tabs.accounts.addAccounts.popup.added.addMore });
                            button.on('click', () => {
                                content.after( app.pages.resources.tabs.accounts.addAccounts.popup.tabs.tdata.render() )
                                content.remove();
                            })

                            content.append( button )
                        }
                    }
                },
                session: {
                    render: () => {
                        const content = $('<DIV/>', { class: 'accounts_tab-content tab-session' });
                        const text = $('<P/>', { text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.session.description });
                        const password = $('<INPUT/>', { class: 'tab-session_2fa', type: 'text', placeholder: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.session.input });
                        const api = $('<INPUT/>', { class: 'tab-session_api', placeholder: 'Custom Api id:hash 18599751:6d3f9221b64c3b3e067add33ad58f416' });
                        const coming = $('<DIV/>', { class: 'tab-session_coming', text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.session.comingSoon });
                        const button = $('<DIV/>', { class: 'button tab-session_button', text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.session.button.selectFolder });

                        return content.append(
                            text,
                            password,
                            api,
                            button,
                            coming
                        )
                    }
                },
                sms: {
                    render: () => {
                        const content = $('<DIV/>', { class: 'accounts_tab-content tab-sms' });
                        const api = $('<INPUT/>', { class: 'tab-sms_api', placeholder: 'Custom Api id:hash 18599751:6d3f9221b64c3b3e067add33ad58f416' });
                        const phone = $('<INPUT/>', { class: 'tab-sms_phone', type: 'text', placeholder: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.sms.inputs.phone });
                        const sms = $('<INPUT/>', { class: 'tab-sms_sms', type: 'text', placeholder: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.sms.inputs.sms });
                        const button = $('<DIV/>', { class: 'button tab-sms_button', text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.sms.button.sms });
                        const coming = $('<DIV/>', { class: 'tab-sms_coming', text: lang.pages.resources.tabs.accounts.addAccounts.popup.tabs.sms.comingSoon });

                        return content.append(
                            api,
                            phone,
                            sms,
                            button,
                            coming
                        )

                    }
                }
            }
        }
    },
    check: {
        once: (account) => {

        },
        all: () => {

        }
    },
    remove: {
        once: (account) => {

        },
        all: () => {

        }
    }
}
