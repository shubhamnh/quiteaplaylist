<template>
 <main class="flex flex-col flex-grow justify-center items-center px-4 md:px-8 py-3 text-left">
        
    <article class="max-w-2xl px-3 py-4 sm:py-8 space-y-3">
      <h1 class="text-xl md:text-2xl font-semibold my-3 md:my-5">Terms and Conditions</h1>
      <p class="text-sm">Last Changes: {{ date }}</p>

      <p>
        By accessing and using this website, you agree to be bound by these terms and conditions of use. If you do not agree to these terms and conditions, you may not use this website.
      </p>
      <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">User Conduct</h2>
      <p>
        You may only use this website for lawful purposes and in compliance with these terms and conditions. You agree not to use the website:
      </p>
      <ul class="list-disc list-outside space-y-3 pl-6">
        <li>In any way that violates any applicable federal, state, local, or international law or regulation;</li>
        <li>To engage in any activity that is fraudulent, illegal, or harmful to us, our users, or any third party;</li>
        <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
      </ul>
      <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Access and Use</h2>
      <p>
        We grant you a non-exclusive, non-transferable, limited right to access and use this website for your personal use. You acknowledge that we may change, update, or terminate the website or any of its features at any time without prior notice.
      </p>
      <!-- <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Intellectual Property</h2>
      <p>
        The SaaS website and its contents, features, and functionality, including but not limited to all information, software, text, graphics, logos, button icons, images, and audio clips (the "Content"), are the property of us or our licensors and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
      </p> -->
      <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Disclaimer of Warranties</h2>
      <p>
        This website is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of the website, its contents, or any information made available by the website.
      </p>
      <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Limitation of Liability</h2>
      <p>
        In no event shall we or our affiliates, licensors, directors, officers, employees, or agents be liable to you or any third party for any indirect, consequential, incidental, special, or punitive damages arising out of or relating to your use of the SaaS website, even if we have been advised of the possibility of such damages.
      </p>
      <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Indemnification</h2>
      <p>
        You agree to indemnify and hold us, our affiliates, licensors, directors, officers, employees, and agents harmless from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your use of the SaaS website, your violation of these terms and conditions, or your violation of any rights of another.
      </p>
      <!-- <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Governing Law</h2>
      <p>
        These terms and conditions shall be governed by and construed in accordance with the laws of the State of [state] without giving effect to any principles of conflicts of law.
      </p> -->
      <h2 id="refund" class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Refund Policy</h2>
        <p>Thank you for supporting the website by your donation.</p>
        <p>Because your donation is voluntary and made with no expectation of receiving goods or services in return, we only offer refunds in the following circumstances:</p>
        <ol class="list-decimal list-outside space-y-3 pl-6">
            <li>If the donation was made in error (e.g. the wrong amount was entered), we will refund the donation amount in full upon request. Please contact us at <a :href="`mailto:`+email">{{ email }}</a> within 7 days of the donation to request a refund.</li>
            <li>If a donation was made fraudulently using your credit card or other payment method, we will refund the donation amount in full upon receipt of a written request from you and documentation of the fraudulent transaction.</li>
        </ol>
        <p>We reserve the right to refuse any refund request that we believe to be fraudulent, suspicious, or in violation of these terms.</p>
        <p>If you have any questions or concerns about your donation or this refund policy, please contact us at <a :href="`mailto:`+email">{{ email }}</a>.</p>

      <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Entire Agreement</h2>
      <p>
        These terms and conditions constitute the entire agreement between you and us regarding the use of the website and supersede all prior agreements and understandings, whether written or oral, relating to the subject matter of these terms and conditions.
        </p>
        <h2 class="text-lg font-semibold md:text-xl pt-5 md:pt-7">Changes to Terms and Conditions</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these terms and conditions at any time. If we make any material changes to these terms and conditions, we will provide notice on the website. Your continued use of the website following the posting of any changes to these terms and conditions constitutes acceptance of those changes.
        </p>

    </article>
    </main>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Terms',
    components: {},
    props: {},
    data() {
      return {
        date: '14th April, 2023',
        email: 'human@quiteaplaylist.com',
      };
    },
    methods: {},
  });
</script>  