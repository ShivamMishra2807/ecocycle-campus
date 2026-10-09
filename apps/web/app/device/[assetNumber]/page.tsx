import React from 'react';
import DeviceTrackingClient from './DeviceTrackingClient';

export function generateStaticParams() {
  return [
    { assetNumber: 'EC-LAP-8821' },
    { assetNumber: 'EC-DSK-4102' },
    { assetNumber: 'EC-MOB-9901' },
    { assetNumber: 'EC-MON-3320' },
  ];
}

export default async function DeviceTrackingPage({
  params,
}: {
  params: Promise<{ assetNumber: string }>;
}) {
  const resolvedParams = await params;
  return <DeviceTrackingClient assetNumber={resolvedParams.assetNumber} />;
}
