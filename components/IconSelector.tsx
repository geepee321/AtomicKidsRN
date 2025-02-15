import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { Text, Modal, Portal } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

// Common task-related icons
const TASK_ICONS = [
  'bed-outline',
  'tooth-outline',
  'shower',
  'food-apple-outline',
  'book-open-outline',
  'basketball-hoop-outline',
  'bike',
  'music-note-outline',
  'palette-outline',
  'school-outline',
  'puzzle-outline',
  'gamepad-variant-outline',
  'dog-side',
  'cat',
  'broom',
  'washing-machine',
  'silverware-fork-knife',
  'hanger',
  'checkbox-blank-circle-outline'
]

type Props = {
  value: string
  onSelect: (iconName: string) => void
}

export default function IconSelector({ value, onSelect }: Props) {
  const [modalVisible, setModalVisible] = useState(false)

  const showModal = () => setModalVisible(true)
  const hideModal = () => setModalVisible(false)

  const handleSelect = (iconName: string) => {
    onSelect(iconName)
    hideModal()
  }

  return (
    <>
      <TouchableOpacity onPress={showModal} style={styles.selector}>
        <MaterialCommunityIcons name={value as any} size={24} color="#666" />
        <Text style={styles.selectorText}>Change Icon</Text>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.modalInner}>
            <Text variant="titleLarge" style={styles.modalTitle}>Select an Icon</Text>
            
            <View style={styles.grid}>
              {TASK_ICONS.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconButton,
                    value === iconName && styles.selectedIcon
                  ]}
                  onPress={() => handleSelect(iconName)}
                >
                  <MaterialCommunityIcons
                    name={iconName as any}
                    size={32}
                    color={value === iconName ? '#4285f4' : '#666'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  )
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const ICON_SIZE = (SCREEN_WIDTH - 80) / 4 // 4 icons per row with padding

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectorText: {
    marginLeft: 8,
    color: '#666',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 5,
    height: '80%',
  },
  modalInner: {
    padding: 20,
    flex: 1,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  iconButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedIcon: {
    backgroundColor: '#e8f0fe',
    borderWidth: 2,
    borderColor: '#4285f4',
  },
}) 