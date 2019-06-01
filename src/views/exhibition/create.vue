<template>
  <exhibition-detail :is-edit="false" />
</template>

<script>
import ExhibitionDetail from './components/ExhibitionDetail'
export default {
  name: 'CreateForm',
  components: { ExhibitionDetail }
}
</script>
