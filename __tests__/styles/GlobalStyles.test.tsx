import { globalStyles } from '~/src/styles/globalStyles';

describe('globalStyles', () => {
    it('should define container styles correctly', () => {
        expect(globalStyles.container).toBeDefined();
        expect(globalStyles.container.flex).toBe(1);
    });

    it('should define center alignment styles correctly', () => {
        expect(globalStyles.center).toMatchObject({
            justifyContent: 'center',
            alignItems: 'center',
        });
    });
});
