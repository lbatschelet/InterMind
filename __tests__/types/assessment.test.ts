import { MOCK_QUESTION } from '~/src/types/assessment';

describe('Assessment Types', () => {
    describe('MOCK_QUESTION', () => {
        it('has the required properties', () => {
            expect(MOCK_QUESTION).toHaveProperty('id');
            expect(MOCK_QUESTION).toHaveProperty('questionText');
            expect(MOCK_QUESTION).toHaveProperty('options');
        });

        it('has valid options', () => {
            MOCK_QUESTION.options.forEach(option => {
                expect(option).toHaveProperty('value');
                expect(option).toHaveProperty('label');
                expect(typeof option.value).toBe('string');
                expect(typeof option.label).toBe('string');
            });
        });

        it('has at least one option', () => {
            expect(MOCK_QUESTION.options.length).toBeGreaterThan(0);
        });
    });
}); 