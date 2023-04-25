import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import RetirementReadinessDashboard from "@dashboards/economy/retirement-readiness";
import { withi18n } from "@lib/decorators";

const RetirementReadiness: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["common", "dashboard-retirement-readiness"]);

  return (
    <>
      <Metadata
        title={t("dashboard-retirement-readiness:header")}
        description={t("dashboard-retirement-readiness:description")}
        keywords={""}
      />
      <RetirementReadinessDashboard />
    </>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-retirement-readiness",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {},
      revalidate: 60 * 60 * 24, // 1 day (in seconds)
    };
  }
);

export default RetirementReadiness;
