import { useState } from "react";
import { Text, View, TextInput, Button, Image, Alert } from "react-native";
import { GoogleGenAI } from "@google/genai";

export default function Index() {
  const [text, setText] = useState("");
  const [imageUri, setImageUri] = useState("");

  const handlePress = async () => {
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBJYvHNfpXHALN18-hRqfsiRsbY7SCwYEk" });
    const contents = text;

    try {
      // Set responseModalities to include "Image" so the model can generate  an image
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp-image-generation',
        contents: contents,
        config: {
          responseModalities: ['Text', 'Image']
        },
      });
      const data = response;
      if (data.candidates && data.candidates[0].content.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.text) {
            Alert.alert("Response", part.text); // Show text response in an alert
          } else if (part.inlineData) {
            const imageData = part.inlineData.data;
            setImageUri(`data:image/png;base64,${imageData}`); // Store base64 image URI
          }
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate image");
      console.error("Error generating content:", error);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }} >
      <>
        <TextInput placeholder="Enter text" value={text} onChangeText={setText} />
        <Button title="Submit" onPress={handlePress} />
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      </>
    </View>
  );
}