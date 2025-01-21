import { AssessmentService } from '~/src/services/assessment';
import { LocationData } from '~/src/services/location';
import { supabase } from '~/src/services/supabase';
import { UserService } from '~/src/services/user';
import { QuestionType } from '~/src/types/Question';

// Mock der externen Services
jest.mock('~/src/services/user');
jest.mock('~/src/services/supabase');
jest.mock('@react-native-async-storage/async-storage');

describe('AssessmentService', () => {
    const mockDeviceId = 'TEST-DEVICE-1';
    const mockLocation: LocationData = {
        latitude: 46.943,
        longitude: 7.384,
        accuracy: 10,
        timestamp: Date.now()
    };

    beforeEach(() => {
        // Reset aller Mocks vor jedem Test
        jest.clearAllMocks();
        
        // Mock der UserService.getUserId Funktion
        (UserService.getUserId as jest.Mock).mockResolvedValue(mockDeviceId);
        
        // Mock der Supabase RPC Funktion
        (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: null });
    });

    describe('createAssessment', () => {
        it('sollte die device_id in der Session setzen und ein Assessment erstellen', async () => {
            // Mock der Supabase Insert Funktion
            const mockDbAssessment = {
                id: '123',
                device_id: mockDeviceId,
                started_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                completed_at: null,
                location: mockLocation
            };
            
            const mockSupabaseResponse = {
                data: mockDbAssessment,
                error: null
            };
            
            const mockSelect = jest.fn().mockResolvedValue(mockSupabaseResponse);
            const mockSingle = jest.fn().mockReturnValue({ select: mockSelect });
            const mockInsert = jest.fn().mockReturnValue({ single: mockSingle });
            
            (supabase.from as jest.Mock).mockReturnValue({
                insert: mockInsert
            });

            const result = await AssessmentService.createAssessment(mockLocation);

            // Überprüfe ob device_id korrekt gesetzt wurde
            expect(supabase.rpc).toHaveBeenCalledWith('set_device_id', { device_id: mockDeviceId });
            
            // Überprüfe ob Assessment korrekt erstellt wurde
            expect(result).not.toBeNull();
            expect(result?.deviceId).toBe(mockDeviceId);
            expect(result?.location).toEqual(mockLocation);
        });

        it('sollte null zurückgeben wenn ein Fehler auftritt', async () => {
            // Mock eines Fehlers
            const mockError = new Error('Datenbankfehler');
            const mockSupabaseResponse = {
                data: null,
                error: mockError
            };
            
            const mockSelect = jest.fn().mockResolvedValue(mockSupabaseResponse);
            const mockSingle = jest.fn().mockReturnValue({ select: mockSelect });
            const mockInsert = jest.fn().mockReturnValue({ single: mockSingle });
            
            (supabase.from as jest.Mock).mockReturnValue({
                insert: mockInsert
            });

            const result = await AssessmentService.createAssessment(mockLocation);

            expect(result).toBeNull();
        });
    });

    describe('saveAnswer', () => {
        const mockAnswer = {
            assessment_id: '123',
            question_id: '456',
            answer_value: 1,
            question_type: 'single_choice' as QuestionType
        };

        it('sollte die device_id setzen und eine Antwort speichern', async () => {
            // Mock der Supabase Insert Funktion
            (supabase.from as jest.Mock).mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                            data: mockAnswer,
                            error: null
                        })
                    })
                })
            });

            const result = await AssessmentService.saveAnswer(
                mockAnswer.assessment_id,
                mockAnswer.question_id,
                mockAnswer.answer_value,
                mockAnswer.question_type
            );

            // Überprüfe ob device_id korrekt gesetzt wurde
            expect(supabase.rpc).toHaveBeenCalledWith('set_device_id', { device_id: mockDeviceId });
            
            // Überprüfe ob Antwort korrekt gespeichert wurde
            expect(result).not.toBeNull();
            expect(result?.assessment_id).toBe(mockAnswer.assessment_id);
            expect(result?.answer_value).toBe(mockAnswer.answer_value);
        });

        it('sollte null zurückgeben wenn ein Fehler auftritt', async () => {
            // Mock eines Fehlers
            (supabase.from as jest.Mock).mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                            data: null,
                            error: new Error('Datenbankfehler')
                        })
                    })
                })
            });

            const result = await AssessmentService.saveAnswer(
                mockAnswer.assessment_id,
                mockAnswer.question_id,
                mockAnswer.answer_value,
                mockAnswer.question_type
            );

            expect(result).toBeNull();
        });
    });
}); 