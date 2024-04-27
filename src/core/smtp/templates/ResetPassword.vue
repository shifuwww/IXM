<script setup lang="ts">
defineProps<{
  url: string
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
    <EPreview>Восстановление доступа</EPreview>
    <EBody :style="styles.body">
      <EContainer>
        <ESection :style="styles.main">
          <EHeading
            :style="{
              fontSize: '20px',
              fontWeight: 'bold',
            }"
          >
            Восстановление доступа
          </EHeading>
          <EText>
            Чтобы восстановить доступ к аккаунту, перейдите по ссылке, нажав кнопку ниже
          </EText>
          <EText :style="{ textAlign: 'center' }">
            <EButton
              :href="url"
              :style="{ padding: '8px 12px', borderRadius: '4px', backgroundColor: '#6366F1', fontSize: '16px', color: '#fff' }"
            >
              Восстановить доступ
            </EButton>
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