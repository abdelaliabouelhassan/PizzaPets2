<script setup>
import LoginModal from './LoginModal.vue'
import { useModalStore } from '@/stores/modal.js'
import { useAuthStore } from '@/stores/auth.js'
import { addressShortening } from '@/utils/address.js'

const modalStore = useModalStore()
const authStore = useAuthStore()
</script>

<template>
  <header class="w-full flex items-center justify-between space-x-10 px-4">
    <div>
      <img src="../assets/logo.svg" class="w-full h-full" alt="" />
    </div>

    <div class="relative">
      <div class="absolute top-14">
        <ul
          v-if="authStore.logoutOpen"
          role="menu"
          data-popover="profile-menu"
          data-popover-placement="bottom"
          class="flex min-w-[180px] flex-col gap-2 overflow-auto hover:scale-105 duration-200 border-4 bg-yellow font-sans text-sm font-normal text-[#000000] shadow-lg shadow-blue-gray-500/10 focus:outline-none"
        >
          <li role="none">
            <button
              role="menuitem"
              class="flex justify-center w-full cursor-pointer select-none items-center border-black border-4 gap-2 px-3 pt-[9px] pb-2 text-start leading-tight outline-none transition-all hover:bg-brown hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-brown focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
              @click="authStore.signOut"
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
                  fill="#ffffff"
                ></path>
              </svg>
              <p class="block font-bold text-white text-sm antialiased leading-normal text-inherit">
                Sign Out
              </p>
            </button>
          </li>
        </ul>
      </div>
      <button
        v-if="authStore.walletAddress == ''"
        @click="modalStore.openModal"
        class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
      >
        Connect wallet
      </button>
      <button
        v-else
        @click="authStore.openLogout"
        class="py-3 px-4 bg-[#FF5400] text-white text-[18px] h-[48px] min-w-[178px] border-4 border-black ring-4 ring-white hover:scale-105 duration-200 mr-1 cursor-pointer flex items-center justify-center"
      >
        {{ addressShortening(authStore.walletAddress) }}
      </button>
    </div>
  </header>

  <LoginModal />
</template>
