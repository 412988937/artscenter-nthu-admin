<template>
  <exhibition-detail :is-edit="true" />
</template>

<script>
import ExhibitionDetail from './components/ExhibitionDetail'
export default {
  name: 'EditForm',
  components: { ExhibitionDetail }
}
</script>
