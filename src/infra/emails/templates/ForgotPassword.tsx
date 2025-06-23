
import { Column } from '@react-email/column';
import { Heading } from '@react-email/heading';
import { Html } from '@react-email/html';
import { Row } from '@react-email/row';
import { Section } from '@react-email/section';
import React from 'react';

import { TailwindConfig } from "../components/TailwindConfig";

interface IForgotpasswordProps {
  confirmationCode: string
}

export default function ForgotPassword({ confirmationCode }: IForgotpasswordProps) {
  return (
    <TailwindConfig>
      <Html>
        <Section>
          <Row>
            <Column className="font-sans text-center p-10 ">
              <Heading as="h1" className="text-2xl">
                🍏 Foodiary
              </Heading>
              <Heading as="h2" className="font-normal text-lg text-gray-600 leading-[1]">
                Recupere sua conta e mude sua saúde!
              </Heading>
            </Column>
          </Row>

          <Row>
            <Column className="text-center p-10">
              <span className="bg-gray-200 inline-block px-8 py-4 text-3xl font-sans rounded-md font-bold tracking-[10px]">
                {confirmationCode}
              </span>
            </Column>
          </Row>

          <Row>
            <Column className="font-sans text-center pt-5">
              <Heading as="h2" className="font-normal text-lg text-gray-600 leading-[1]">
                Se você não solicitou esta recuperação de senha, fique tranquilo sua conta continua segura!
              </Heading>
            </Column>
          </Row>

        </Section>
      </Html>
    </TailwindConfig>
  );
}

ForgotPassword.PreviewProps = {
  confirmationCode: '123123'
}

