<script setup>
import { ref, computed, onMounted } from 'vue'

//Props
const props = defineProps(["year", "month", "date", "hour", "minutes", "seconds"])

//Data
const displayDays = ref(0)
const displayHours = ref(0)
const displayMinutes = ref(0)
const displaySeconds = ref(0)
const loaded = ref(false)
const expired = ref(false)

//Computed
const _seconds = computed(() => 1000)
const _minutes = computed(() => _seconds.value * 60)
const _hours = computed(() => _minutes.value * 60)
const _days = computed(() => _hours.value * 24)


const end = () => {
  return new Date(
    props.year,
    props.month,
    props.date,
    props.hour,
    props.minutes,
    props.seconds
  )
}

//Mounted
onMounted(() => {
  showRemaining()
})

//Metodos
const formatNum = (num) => num < 10 ? '0' + num : num

const showRemaining = () => {
  const timer = setInterval(() => {

    const now = new Date();
    //const end = new Date(2023, 6, 15, 22, 0, 0, 0);
    const distance = end().getTime() - now.getTime();

    if (distance < 0) {
      clearInterval(timer);
      expired.value = true;
      loaded.value = true;
      return;
    }

    const days = Math.floor((distance / _days.value));
    const hours = Math.floor((distance % _days.value) / _hours.value);
    const minutes = Math.floor((distance % _hours.value) / _minutes.value);
    const seconds = Math.floor((distance % _minutes.value) / _seconds.value);

    displayMinutes.value = formatNum(minutes);
    displaySeconds.value = formatNum(seconds);
    displayHours.value = formatNum(hours);
    displayDays.value = formatNum(days);
    loaded.value = true;

  }, 1000);
}

</script>

<template>
  <div v-if="loaded">
    <section v-if="!expired" class="flex text-h4 justify-center">
      <div class="days mr-2 relative text-grey-8">
        {{ displayDays }}
        <div class="label text-caption text-center">dias</div>
      </div>
      <span class="leading-snug text-grey-8">:</span>

      <div class="hours mx-2 relative text-grey-8">
        {{ displayHours }}
        <div class="label text-caption text-center">horas</div>
      </div>
      <span class="leading-snug text-grey-8">:</span>

      <div class="minutes mx-2 relative text-grey-8">
        {{ displayMinutes }}
        <div class="label text-caption text-center">min</div>
      </div>
      <span class="leading-snug text-grey-8">:</span>

      <div class="seconds ml-2 relative text-grey-8">
        {{ displaySeconds }}
        <div class="label text-caption text-center">seg</div>
      </div>
    </section>

    <section v-else>
      <h3 class="countdown__regresiveCero">Carrera Disputandose!!</h3>
    </section>
  </div>
</template>

<style>
.regresiveCero {
  font-family: 'Roboto';
  font-size: 2rem;
  font-weight: lighter;
  background-color: red;
}
</style>
