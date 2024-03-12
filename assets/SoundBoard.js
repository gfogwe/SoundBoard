import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
const preRecordedSounds = [
    { name: 'amen', file: require('./amen.mp3') },
    { name: 'trap-loop', file: require('./trap-loop.mp3') },
    { name: 'dramaticEntrance', file: require('./drramaticEntrance.mp3') }, // Corrected spelling
    { name: 'TechUpbeat', file: require('./TechUpbeat.mp3') },
    { name: 'GuitarWop', file: require('./GuitarWop.mp3') },
    // Add more sound files here
];

const SoundboardScreen = () => {
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [message, setMessage] = useState("");

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );
                setRecording(recording);
                setMessage("Recording started...");
            } else {
                setMessage("Microphone permission denied.");
            }
        } catch (err) {
            console.error('Failed to start recording', err);
            setMessage("Failed to start recording: " + err.message);
        }
    }


    async function stopRecording() {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordings([...recordings, { uri }]);
        setMessage("Recording stopped.");
    }

    const playSound = async (asset) => {
        if (!asset) {
            console.error('Cannot play sound because the source is null');
            return;
        }
        try {
            // Handling both local files (require) and recorded URIs
            const source = typeof asset === 'string' ? { uri: asset } : asset;
            const { sound } = await Audio.Sound.createAsync(source);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound: ', error);
        }
    };



    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.welcomeText}>Welcome to Gerhardt's Soundboard go crazy</Text>
                <Text>Pre-recorded Sounds:</Text>
                <View style={styles.gridContainer}>
                    {preRecordedSounds.map((sound, index) => (
                        <TouchableOpacity key={index} style={styles.gridItem} onPress={() => playSound(sound.file)}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>{sound.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.startRecordingButtonContainer}>
                    <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.startRecordingButton}>
                        <Text style={styles.startRecordingButtonText}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
                    </TouchableOpacity>
                </View>
                <Text>{message}</Text>
                <Text>User Recordings:</Text>
                {recordings.map((recording, index) => (
                    <View key={index} style={styles.recordingList}>
                        <Text>Recording {index + 1} - </Text>
                        <Button title="Play" onPress={() => playSound(recording.uri)} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        padding: 20,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center', 
    },
    startRecordingButtonContainer: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%', // Ensure the button container takes the full width
        alignItems: 'center', // Center the button horizontally within the container
    },
    startRecordingButton: {
        backgroundColor: 'blue', // Button background color
        padding: 10,
        borderRadius: 5,
        width: '60%', // Adjust the width of the button as per your design
        alignItems: 'center', // This ensures the text is centered within the button
    },
    startRecordingButtonText: {
        color: 'white',
        fontSize: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%', // Ensure grid takes full width to align items properly
    },
    gridItem: {
        width: '45%', // Adjust based on desired number of columns and container padding
        marginVertical: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        width: '100%', // Make the button fill its container
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20, // Adds vertical spacing above and below the text
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    recordingList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%', // Ensure list items take full width for consistent alignment
        marginVertical: 5,
},

});


export default SoundboardScreen;
