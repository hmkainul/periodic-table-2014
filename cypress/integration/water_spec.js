describe('Calculator', () => {
    beforeEach(() => cy.visit('https://thisperiodictable.com'))
    const aG = 'Ag'
    const c = 'C'
    const h = 'H'
    const o = 'O'
    it('should handle water', () =>
        calculate([h, h, o], 'H2 O', '18.015')
    )
    it('should handle silver acetate', () =>
        calculate([aG, o, o, h, h, h, c, c], 'C2 H3 Ag O2', '166.9122')
    )
    function calculate(clicks, formula, mass) {
        clicks.forEach(id => cy.get('#' + id).click())
        cy.get('#formula_value').contains(formula)
        cy.get('#mass_value').contains(mass)
    }
})
