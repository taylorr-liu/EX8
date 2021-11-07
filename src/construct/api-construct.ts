import { RestApi, LambdaIntegration, Resource, RestApiProps } from '@aws-cdk/aws-apigateway';
import { Function } from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';

export interface ItemsAPIProps extends RestApiProps {
  /**
     * @CURDLambdaFunctions Functions for CURD unspecified items
     */
  generalLambdaFunctions?: CURDLambdaFunctions;
  /**
     * @CURDLambdaFunctions Functions for CURD specified items
     */
  specificLambdaFunctions?: CURDLambdaFunctions;
}

export interface CURDLambdaFunctions {
  /**
     * @Function Function for the GET method
     */
  GET?: Function;

  /**
     * @Function Function for the POST method
     */
  POST?: Function;

  /**
     * @Function Function for the PUT method
     */
  PUT?: Function;

  /**
     * @Function Function for the DELETE method
     */
  DELETE?: Function;
}

export class ItemsAPI extends RestApi {
  /**
     * @Resource The API Resource of general methods.
     */
  public readonly generalMethodEntry: Resource;

  /**
     * @Resource The API Resource of specific methods.
     */
  public readonly specificMethodEntry: Resource;

  /**
     * The API with two kinds of resource, general methods and specific methods.
     * @param scope
     * @param id
     * @param props
     */
  constructor(scope: Construct, id: string, props: ItemsAPIProps) {
    super(scope, id, props);
    this.generalMethodEntry = this.root.addResource('items');
    this.specificMethodEntry = this.generalMethodEntry.addResource('{id}');

    if (props.generalLambdaFunctions) {
      this.setGeneralLambdaFunctions(props.generalLambdaFunctions);
    }
    if (props.specificLambdaFunctions) {
      this.setSpecificLambdaFunctions(props.specificLambdaFunctions);
    }
  }

  /**
     * Set the methods for the API resource.
     * @param resource
     * @param lambdaFuncs
     */
  private setLambdaFunctions(resource: Resource, lambdaFuncs: CURDLambdaFunctions) {
    if (lambdaFuncs.GET) {
      resource.addMethod('GET', new LambdaIntegration(lambdaFuncs.GET));
    }
    if (lambdaFuncs.POST) {
      resource.addMethod('POST', new LambdaIntegration(lambdaFuncs.POST));
    }
    if (lambdaFuncs.PUT) {
      resource.addMethod('PUT', new LambdaIntegration(lambdaFuncs.PUT));
    }
    if (lambdaFuncs.DELETE) {
      resource.addMethod('DELETE', new LambdaIntegration(lambdaFuncs.DELETE));
    }
  }

  /**
     * Set the lambda functions for the general methods.
     * @param lambdaFuncs The lambda functions for the general methods.
     */
  public setGeneralLambdaFunctions(lambdaFuncs: CURDLambdaFunctions) {
    this.setLambdaFunctions(
      this.generalMethodEntry,
      lambdaFuncs,
    );
  }

  /**
     * Set the lambda functions for the specific methods.
     * @param lambdaFuncs The lambda functions for the general methods.
     */
  public setSpecificLambdaFunctions(lambdaFuncs: CURDLambdaFunctions) {
    this.setLambdaFunctions(
      this.specificMethodEntry,
      lambdaFuncs,
    );
  }
}