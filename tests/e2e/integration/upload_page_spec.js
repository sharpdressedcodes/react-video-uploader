const filesMock = require('../../fixtures/filesMock');

const url = '/upload';

function createDataTransfer(files) {
    const transfer = new DataTransfer();

    files.forEach(item => {
        transfer.items.add(item);
    });

    return transfer;
}

describe('The Upload Page', () => {
    beforeEach(() => {
        cy.visit(url);
    });

    it(`Should successfully load`, () => {
        cy.get('.page-upload')
            .should(el => {
                expect(el).to.have.length(1);
            });

        cy.get('h2')
            .should(el => {
                expect(el).to.have.length(1);
            })
            .should('have.text', 'Upload');

        cy.get('.content')
            .should(el => {
                expect(el).to.have.length(1);
            });
    });

    it(`Should render the Uploader component in default state`, () => {
        cy.get('.uploader')
            .should(el => {
                expect(el).to.have.length(1);
            });

        cy.get('.form-upload')
            .should(el => {
                expect(el).to.have.length(1);
            });

        cy.get('.form-upload button[type="submit"]')
            .should(el => {
                expect(el).to.have.length(1);
            });

        cy.get('.form-upload input[type="file"]')
            .should(el => {
                expect(el).to.have.length(1);
            });

        cy.get('.files')
            .should(el => {
                expect(el).to.have.length(0);
            });

        cy.get('.form-upload button[type="submit"]')
            .should('have.attr', 'disabled');

        cy.get('.status-files > span')
            .should('have.text', 'No files selected');
    });

    it(`Should fail validation because the file is too large`, () => {
        cy.get('.files')
            .should(el => {
                expect(el).to.have.length(0);
            });

        cy.get('.form-upload button[type="submit"]')
            .should('have.attr', 'disabled');

        cy.get('.status-files > span')
            .should('have.text', 'No files selected');

        const transfer = createDataTransfer(filesMock.fileTooLarge);

        cy.get('.form-upload input[type="file"]')
            .then(subject => {
                const el = subject[0];

                el.files = transfer.files;

                cy.get('.status-files > span')
                    .should('have.text', 'No files selected');

                cy.get('.form-upload button[type="submit"]')
                    .should('have.attr', 'disabled');
            });
    });

    it(`Should fail validation because the file has the wrong file extension`, () => {
        cy.get('.files')
            .should(el => {
                expect(el).to.have.length(0);
            });

        cy.get('.form-upload button[type="submit"]')
            .should('have.attr', 'disabled');

        cy.get('.status-files > span')
            .should('have.text', 'No files selected');

        const transfer = createDataTransfer(filesMock.fileWrongFileExtension);

        cy.get('.form-upload input[type="file"]')
            .then(subject => {
                const el = subject[0];

                el.files = transfer.files;

                cy.get('.status-files > span')
                    .should('have.text', 'No files selected');

                cy.get('.form-upload button[type="submit"]')
                    .should('have.attr', 'disabled');
            });
    });

    // it(`Should fail validation because the file has the wrong file header`, () => {
    //     const transfer = createDataTransfer(filesMock.fileBadHeader);
    //
    //     cy.get('.form-upload input[type="file"]')
    //         .then(subject => {
    //             const el = subject[0];
    //
    //             el.files = transfer.files;
    //
    //             cy.get('.status-files > span')
    //                 .should('not.have.text', 'No files selected');
    //
    //             cy.get('.form-upload button[type="submit"]')
    //                 .should('not.have.attr', 'disabled');
    //
    //             // // cy.server();
    //             // // cy.route('POST', '/api/video/upload').as('upload');
    //             // cy.intercept({ method: 'POST', path: '/api/video/upload' }).as('upload');
    //             //
    //             // cy.get('.form-upload button[type="submit"]').click();
    //             // // cy.wait('@upload');
    //             // //
    //             // // cy.get('@upload').then(xhr => {
    //             // //     const keys = Object.keys(xhr.responseBody);
    //             // //
    //             // //     expect(xhr.status).to.eq(200);
    //             // //     expect(keys.length).to.be.gt(0);
    //             // //     expect(keys.includes('errors')).to.be.true;
    //             // //     expect(Array.isArray(xhr.responseBody.errors)).to.be.true;
    //             // //     expect(xhr.responseBody.errors.length).to.eq(1);
    //             // //     expect(xhr.responseBody.errors[0].includes('is an invalid file')).to.be.true;
    //             // // });
    //             //
    //             // cy.wait('@upload').then(({ request, response }) => {
    //             //     const keys = Object.keys(response.body);
    //             //
    //             //     expect(response.statusCode).to.eq(200);
    //             //     expect(keys.length).to.be.gt(0);
    //             //     expect(keys.includes('errors')).to.be.true;
    //             //     expect(Array.isArray(response.body.errors)).to.be.true;
    //             //     expect(response.body.errors.length).to.eq(1);
    //             //     expect(response.body.errors[0].includes('is an invalid file')).to.be.true;
    //             // });
    //         });
    // });

    it(`Should fail validation because the total size of files is too large`, () => {
        cy.get('.files')
            .should(el => {
                expect(el).to.have.length(0);
            });

        cy.get('.form-upload button[type="submit"]')
            .should('have.attr', 'disabled');

        cy.get('.status-files > span')
            .should('have.text', 'No files selected');

        const transfer = createDataTransfer(filesMock.filesTooLarge);

        cy.get('.form-upload input[type="file"]')
            .then(subject => {
                const el = subject[0];

                el.files = transfer.files;

                cy.get('.status-files > span')
                    .should('have.text', 'No files selected');

                cy.get('.form-upload button[type="submit"]')
                    .should('have.attr', 'disabled');
            });
    });

    it(`Should fail validation because there are too many files`, () => {
        cy.get('.files')
            .should(el => {
                expect(el).to.have.length(0);
            });

        cy.get('.form-upload button[type="submit"]')
            .should('have.attr', 'disabled');

        cy.get('.status-files > span')
            .should('have.text', 'No files selected');

        const transfer = createDataTransfer(filesMock.tooManyFiles);

        cy.get('.form-upload input[type="file"]')
            .then(subject => {
                const el = subject[0];

                el.files = transfer.files;

                cy.get('.status-files > span')
                    .should('have.text', 'No files selected');

                cy.get('.form-upload button[type="submit"]')
                    .should('have.attr', 'disabled');
            });
    });

    // it(`Should pass validation`, () => {
    //     cy.get('.files')
    //         .should(el => {
    //             expect(el).to.have.length(0);
    //         });
    //
    //     cy.get('.form-upload button[type="submit"]')
    //         .should('have.attr', 'disabled');
    //
    //     cy.get('.status-files > span')
    //         .should('have.text', 'No files selected');
    //
    //     const transfer = createDataTransfer(filesMock.pass);
    //
    //     cy.get('.form-upload input[type="file"]')
    //         .then(subject => {
    //             const el = subject[0];
    //
    //             el.files = transfer.files;
    //
    //             cy.get('.status-files > span')
    //                 .should('not.have.text', 'No files selected');
    //
    //             cy.get('.form-upload button[type="submit"]')
    //                 .should('not.have.attr', 'disabled');
    //         });
    // });
});
