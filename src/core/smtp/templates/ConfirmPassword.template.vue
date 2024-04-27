<script setup lang="ts">
defineProps<{
  code: string
}>();

const styles = {
  body: {
    backgroundColor: '#edf2f6'
  },
  main: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  },
  code: {
    textAlign: 'center',
  },
}
</script>

<template>
  <EHtml>
    <EHead />
    <EPreview>Код подтверждения</EPreview>
    <EBody :style="styles.body">
      <EContainer>
        <ESection :style="styles.main">
          <EHeading
            :style="{
              fontSize: '20px',
              fontWeight: 'bold',
            }"
          >
            Код подтверждения
          </EHeading>
          <EText :style="{ fontSize: '18px' }">
            Ваш код подтверждения:
            <b>{{ code }}</b>
          </EText>
        </ESection>
        <EText
          :style="{
            textAlign: 'center',
            fontSize: 10,
            color: '#9fa4a7',
          }"
        >
          © 2024 | TEST
        </EText>
      </EContainer>
    </EBody>
  </EHtml>
</template>

<style scoped>

</style>