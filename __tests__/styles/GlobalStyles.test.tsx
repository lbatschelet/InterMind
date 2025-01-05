import { globalStyles } from 'src/styles/globalStyles';

describe('globalStyles', () => {
    it('should define container styles correctly', () => {
        expect(globalStyles.container).toMatchObject({
            flex: 1,
            padding: 16,
            backgroundColor: '#f8f9fa',
        });
    });

    it('should define center alignment styles correctly', () => {
        expect(globalStyles.center).toMatchObject({
            justifyContent: 'center',
            alignItems: 'center',
        });
    });
});
