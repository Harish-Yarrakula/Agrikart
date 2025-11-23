"use client"
import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import {
  Footer,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import { useTranslation } from "react-i18next";

function Footers() {
  const { t } = useTranslation("common");

  return (
    <Footer container className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div>
            <Link href="/DashBoard" className="flex items-center mb-4">
              <Image src="/logo.png" alt={t('footer.logoAltText')} width={160} height={50} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <FooterTitle title={t('footer.links.about.title')} />
              <FooterLinkGroup col>
                <FooterLink href="#">{t('footer.links.about.agriKart')}</FooterLink>
                <FooterLink href="#">{t('footer.links.about.agriProducts')}</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title={t('footer.links.follow.title')} />
              <FooterLinkGroup col>
                <FooterLink href="#">{t('footer.links.follow.github')}</FooterLink>
                <FooterLink href="#">{t('footer.links.follow.discord')}</FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title={t('footer.links.legal.title')} />
              <FooterLinkGroup col>
                <FooterLink href="#">{t('footer.links.legal.privacyPolicy')}</FooterLink>
                <FooterLink href="#">{t('footer.links.legal.termsAndConditions')}</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider className="my-6 border-gray-700" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <FooterCopyright href="#" by={t('footer.copyright')} year={2025} />
          <div className="mt-4 flex space-x-6 sm:mt-0">
            <FooterIcon href="#" icon={BsFacebook} />
            <FooterIcon href="#" icon={BsInstagram} />
            <FooterIcon href="#" icon={BsTwitter} />
            <FooterIcon href="#" icon={BsGithub} />
            <FooterIcon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default Footers;