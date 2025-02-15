import React from 'react'
import { View, StyleSheet, Image, Dimensions } from 'react-native'
import { Modal, Portal } from 'react-native-paper'
import { Image as ExpoImage } from 'expo-image'

type Props = {
  visible: boolean
  onDismiss: () => void
  gifUrl: string
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const GIF_WIDTH = Math.min(300, SCREEN_WIDTH - 80)

export default function CelebrationModal({ visible, onDismiss, gifUrl }: Props) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContent}
      >
        <View style={styles.gifContainer}>
          <ExpoImage
            source={{ uri: gifUrl }}
            style={styles.gif}
            contentFit="contain"
          />
        </View>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'transparent',
    padding: 20,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifContainer: {
    width: GIF_WIDTH,
    height: GIF_WIDTH,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
}) 