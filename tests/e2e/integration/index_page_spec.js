const url = '/';

describe(`The Home Page`, () => {
    it(`Should successfully load`, () => {
        cy.visit(url);

        cy.get('h1')
            .should(el => {
                expect(el).to.have.length(1);
            });

        cy.get('.page')
            .should(el => {
                expect(el).to.have.length(1);
            });

        cy.get('h1')
            .should('have.text', 'Video Uploader');

        cy.get('.navbar ul li:nth-child(1)')
            .should('have.text', 'Home');

        cy.get('.navbar ul li:nth-child(2)')
            .should('have.text', 'Upload');
    });
});
