<template>
  <search-box
    category="닉네임(첫 검색 대소문자 구분)"
    :matchingData="{type: 'string', data: matchingData}"
    :defaultMatchingList="false"
    :size="size"
    resultPath="/character"
    :paramKey="['nickname']"
  />
</template>

<script>
export default {
  props: {
    matchingData: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: () => "basic"
    }
  }
}
</script>