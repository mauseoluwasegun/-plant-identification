import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);
// process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
export async function identifyPlant(image: File): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const imageData = await fileToBase64(image);
    
    const imageParts = [
      {
        inlineData: {
          data: imageData,
          mimeType: image.type,
        },
      },
    ];

    const prompt = `Provide a comprehensive plant identification analysis with the following detailed characteristics:

    1. Identification Details:
    - Common Name: Full common name(s) used in various regions
    - Scientific Name: Complete binomial nomenclature
    - Family: Botanical family classification
    - Genus: Specific genus information
    
    2. Botanical Characteristics:
    - Plant Type: (e.g., herb, shrub, tree, vine)
    - Growth Habit: Detailed description of plant's structure
    - Leaf Description: Shape, texture, color, arrangement
    - Flower Characteristics: Color, shape, blooming season
    - Height and Spread: Typical mature size range
    
    3. Ecological and Geographical Information:
    - Native Region: Comprehensive geographical origin
    - Climate Zones: USDA hardiness zones and preferred environments
    - Habitat: Natural ecosystem and growing conditions
    
    4. Cultivation and Care:
    - Sunlight Requirements: Preferred light exposure
    - Soil Preferences: Ideal soil type, pH, drainage
    - Water Needs: Drought tolerance, irrigation recommendations
    - Seasonal Behavior: Dormancy, flowering, fruiting periods
    
    5. Ecological Significance:
    - Ecosystem Role: Interactions with local wildlife
    - Pollination Details: Pollinators and reproduction method
    - Conservation Status: Rarity or environmental importance
    
    6. Additional Context:
    - Cultural Significance: Historical or traditional uses
    - Interesting Botanical Facts: Unique characteristics or adaptations
    
    Please format the response as a comprehensive JSON object that includes all these detailed aspects. Ensure the response is scientifically accurate, informative, and structured for easy parsing.
    
    Example JSON Structure:
    {
      "commonName": "",
      "scientificName": "",
      "family": "",
      "genus": "",
      "plantType": "",
      "growthHabit": "",
      "leafDescription": "",
      "flowerCharacteristics": "",
      "dimensions": {
        "height": "",
        "spread": ""
      },
      "nativeRegion": "",
      "climateZones": [],
      "habitat": "",
      "cultivation": {
        "sunlight": "",
        "soil": "",
        "waterNeeds": "",
        "seasonalBehavior": ""
      },
      "ecologicalRole": {
        "pollinators": [],
        "wildlifeInteractions": "",
        "conservationStatus": ""
      },
      "culturalSignificance": "",
      "botanicalFacts": "",
      "description": ""
    }`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();
    return text; // This should now be a JSON string
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof Error) {
      return JSON.stringify({ error: `Error identifying plant: ${error.message}` });
    }
    return JSON.stringify({ error: 'An unknown error occurred while identifying the plant.' });
  }
}

// ... rest of the file remains the same
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove the data URL prefix
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }