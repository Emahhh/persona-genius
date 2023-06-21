import axios from 'axios';
import { type Persona, jsonToPersona, validatePersona } from './interfaces';

export async function generatePersona(description: string): Promise<Persona> {
    try {
        const options = {
            method: 'POST',
            url: 'http://127.0.0.1:5001/saw-prova/us-central1/generatePersona',
            headers: {'Content-Type': 'application/json'},
            data: {
              description: description
            }
        };

        const response = await axios.request(options);

        console.log("Response recieved from the API generatePersona:", response);
        const generatedPersona: Persona = {...response.data, image: "https://www.w3schools.com/howto/img_avatar.png"}; // TODO: aggiungere immagine in un altro modo
        if (!generatedPersona) throw new Error("Failed to generate persona: got an undefined persona");
        if (!validatePersona(generatedPersona)) throw new Error("Failed to generate persona: this persona is not valid: " + generatedPersona);
        return generatedPersona;
    } catch (error: any) {
        console.error('Error in generatePersona:', error);
        throw new Error('Failed to generate persona: ' + error);
    }
};
