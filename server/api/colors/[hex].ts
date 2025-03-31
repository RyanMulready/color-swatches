import { API_URL } from '~/server/api/colors/constants';
import { mapHexApiResponseToColor } from '~/server/api/colors/mappers';

export default defineEventHandler(async (event) => {
    const hex = event.context.params?.hex;

    if (!hex) {
        throw new Error('No hex query param provided!');
    }

    const resp = await fetch(`${API_URL}/scheme?hex=${hex}`);
    const data = await resp.json();

    return mapHexApiResponseToColor(data);
});
