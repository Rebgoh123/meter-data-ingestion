import { useQuery, useMutation, useQueryClient } from 'react-query';
import BaseApi from '../../../api/BaseApi';
import { useSnackBar } from '../../../hoc/SnackbarHandler/index.jsx';

const fetchMeterReadings = async () => {
    const { data } = await BaseApi.get('meter-readings');  // Adjust API endpoint
    return data;
};

const postMeterReading = async (newReading) => {
    console.log(`newReading`, newReading)
    const { data } = await BaseApi.post('meter-readings', newReading);  // Adjust API endpoint
    return data;
};

export function useMeterReadings() {
    const { setSnackBar } = useSnackBar();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery(
        'meterReadings',
        fetchMeterReadings,
        {
            onError: () => {
                setSnackBar({
                    open: true,
                    message: 'Failed to load meter readings',
                    type: 'error',
                });
            },
            staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        }
    );

    const { mutate: addMeterReading, isLoading: isPosting } = useMutation(
        postMeterReading,
        {
            onSuccess: () => {
                setSnackBar({
                    open: true,
                    message: 'Meter reading added successfully',
                    type: 'success',
                });
                queryClient.invalidateQueries('meterReadings');
            },
            onError: () => {
                setSnackBar({
                    open: true,
                    message: 'Failed to add meter reading',
                    type: 'error',
                });
            },
        }
    );

    return {
        meterReadings: data || [],
        isLoading,
        isError,
        refetch,
        addMeterReading,
        isPosting,
    };
}
