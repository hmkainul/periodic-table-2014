describe('Calculator', () => {
    it('should handle H2O', () => {
        cy.visit('https://thisperiodictable.com')
        cy.get('#H').click().click()
        cy.get('#O').click()
        cy.get('#formula_value').contains('H2 O')
        cy.get('#mass_value').contains('18.015')
    })
})
