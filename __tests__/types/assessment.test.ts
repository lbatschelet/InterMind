import { MOCK_SLEEP_QUESTION } from '~/src/types/assessment';

describe('Assessment Types', () => {
    describe('MOCK_SLEEP_QUESTION', () => {
        it('has the required properties', () => {
            expect(MOCK_SLEEP_QUESTION).toHaveProperty('id');
            expect(MOCK_SLEEP_QUESTION).toHaveProperty('questionText');
            expect(MOCK_SLEEP_QUESTION).toHaveProperty('options');
            expect(MOCK_SLEEP_QUESTION).toHaveProperty('type');
        });

        it('has valid options', () => {
            MOCK_SLEEP_QUESTION.options.forEach((option: { value: string; label: string }) => {
                expect(option).toHaveProperty('value');
                expect(option).toHaveProperty('label');
                expect(typeof option.value).toBe('string');
                expect(typeof option.label).toBe('string');
            });
        });

        it('has at least one option', () => {
            expect(MOCK_SLEEP_QUESTION.options.length).toBeGreaterThan(0);
        });

        it('has valid question type', () => {
            expect(MOCK_SLEEP_QUESTION.type).toBe('single_choice');
        });
    });
}); 