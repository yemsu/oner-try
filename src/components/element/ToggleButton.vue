<template>
  <button
    :class="`button-toggle ${isOn ? 'on' : 'off'}`"
    @click="$emit('click')"
  >
    <span class="text">
      {{ buttonText }}
      {{ isOn ? 'ON' : 'OFF' }}
    </span>
    <span class="icon">
      <font-awesome-icon
        v-if="iconName"
        :icon="isOn ? iconName[0] : iconName[1]"
      />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    isOn: {
      type: Boolean,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    iconName: {
      type: Array,
      default: null // ['on', 'off']
    }
  },
}
</script>

<style lang="scss" scoped>
.button-toggle {
  display: flex;
  align-items: center;
  padding: 3px 3px;
  background-color: var(--lighter-10);
  border-radius: 50px;
  box-shadow: inset 1px 1px 3px var(--color-shadow-light);
  font-size: var(--font-size-S);
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 23px;
    height: 23px;
    border-radius: 100%;
    box-shadow: 1px 1px 3px var(--color-shadow-light);
  }
  .text {
    padding: 0 5px;
  }
  &.on {
    .icon {
      background-color: $color-point;
      border: 1px solid var(--color-point-bright);
      svg {
        font-size: 13px;
        path {
          fill: var(--color-black);
        }
      }
    }
  }
  &.off {
    flex-direction: row-reverse;
    .icon {
      background-color: hsla(var(--hsl-white), 0.4);
      border: 1px solid hsla(var(--hsl-white), 0.2);
      svg {
        font-size: 12px;
        path {
          fill: hsla(var(--hsl-black), 0.6);
        }
      }
    }
  }
}
</style>