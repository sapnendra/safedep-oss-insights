import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb.js";
import { MalwareAnalysisService } from "@buf/safedep_api.connectrpc_es/safedep/services/malysis/v1/malysis_connect.js";
import { createPromiseClient, Interceptor } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";

function authenticationInterceptor(token: string, tenant: string): Interceptor {
  return (next) => async (req) => {
    req.header.set("authorization", token);
    req.header.set("x-tenant-id", tenant);
    return await next(req);
  };
}

// Convert ecosystem string → enum
export function mapEcosystem(ecosystem: string): Ecosystem {
  switch (ecosystem.toLowerCase()) {
    case "npm":
      return Ecosystem.NPM;
    case "pypi":
      return Ecosystem.PYPI;
    case "go":
      return Ecosystem.GO;
    case "maven":
      return Ecosystem.MAVEN;
    case "rubygems":
      return Ecosystem.RUBYGEMS;
    case "cargo":
      return Ecosystem.CARGO;
    case "nuget":
      return Ecosystem.NUGET;
    default:
      throw new Error(`Unsupported ecosystem: ${ecosystem}`);
  }
}

export async function fetchPackageMalysis(params: {
  ecosystem: string;
  name: string;
  version: string;
}) {
  const token = process.env.SAFEDEP_API_KEY;
  const tenantId = process.env.SAFEDEP_TENANT_ID;

  if (!token || !tenantId) {
    throw new Error("SAFEDEP_API_KEY or SAFEDEP_TENANT_ID missing");
  }

  const transport = createConnectTransport({
    baseUrl: "https://api.safedep.io",
    httpVersion: "1.1",
    interceptors: [authenticationInterceptor(token, tenantId)],
  });

  const client = createPromiseClient(MalwareAnalysisService, transport);

  const response = await client.queryPackageAnalysis({
    target: {
      packageVersion: {
        package: {
          ecosystem: mapEcosystem(params.ecosystem),
          name: params.name,
        },
        version: params.version,
      },
    },
  });

  return response.toJson();
}
