const utils = {
    page: {
        clearAll: () => {
            $('body *').remove();
        },
        clearContent: () => {
            $('body .content *').remove();
        }
    }
};
