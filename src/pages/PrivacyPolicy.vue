<template>

    <main class="flex flex-col flex-grow justify-center items-center px-4 md:px-8 py-3 text-left">
      <div class="max-w-2xl px-3 py-4 sm:py-8 space-y-3">

        <h1 class="text-xl md:text-2xl font-semibold my-3 md:my-5">Privacy Policy</h1>

        <p class="text-sm">Last Changes: {{ date }}</p>

        <p>We respect your privacy and are committed to protecting your personal information. This privacy policy explains how we collect, use, and disclose information about you when you use our website {{ websiteUrl }}. By using our website, you consent to the collection, use, and disclosure of your information as described in this policy.</p>

        <h2 id="attributions" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Information We Collect</h2>

        <p>We do not collect any personally identifiable information about you when you use our website. Our website uses Cloudflare Analytics, which does not use any client-side state, such as cookies or localStorage, to collect usage metrics. We also don’t “fingerprint” individuals via their IP address, User Agent string, or any other data for the purpose of displaying analytics.</p>

        <h2 id="attributions" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Use of Information</h2>
        <p>We use the information we collect to analyze how visitors use our website and improve its performance. We do not sell or share this information with third parties.</p>

        <h2 id="attributions" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Disclosure of Information</h2>
        <p>We do not disclose the information we collect to third parties. We may disclose the information if required by law or if we believe that the disclosure is necessary to protect our rights and/or comply with a judicial proceeding, court order, or legal process.</p>

        <h2 id="attributions" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Security</h2>
        <p>We take reasonable steps to protect the information we collect from unauthorized access, disclosure, or destruction. However, no security system is perfect, and we cannot guarantee the security of our website or the information we collect.</p>

        <h2 id="attributions" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Changes to Our Privacy Policy</h2>
        <p>We may update this privacy policy from time to time. If we make significant changes, we will notify you by posting a notice on our website or by email.</p>

        <h2 id="attributions" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Contact Us</h2>
        <p>If you have any questions or concerns about this privacy policy, please contact us at {{ contactInformation }}.</p>
      </div>

    </main>
</template>
  
<script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'PrivacyPolicy',
    data() {
      return {
        date: '13th April, 2023',
        websiteUrl: 'quiteaplaylist.com',
        contactInformation: 'human@quiteaplaylist.com',
      };
    },
    // metaInfo: {
    //   title: 'About',
    //   htmlAttrs: {
    //     lang: 'en',
    //   }
    // }
  });
</script>
  